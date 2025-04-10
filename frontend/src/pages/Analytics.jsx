import React, { useState, useEffect } from 'react';
import { urlService } from '../services/urlService';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await urlService.getUserAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const getDeviceData = () => {
    if (!analytics?.deviceStats) return [];
    return Object.entries(analytics.deviceStats).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getClickHistoryData = () => {
    if (!analytics?.clickHistory) return [];
    return analytics.clickHistory.map(click => ({
      date: new Date(click.timestamp).toLocaleDateString(),
      clicks: click.count
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>

        <Stack spacing={4}>
          {/* Summary Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Links
                  </Typography>
                  <Typography variant="h4">
                    {analytics?.totalLinks || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Clicks
                  </Typography>
                  <Typography variant="h4">
                    {analytics?.totalClicks || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Active Links
                  </Typography>
                  <Typography variant="h4">
                    {analytics?.activeLinks || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Expired Links
                  </Typography>
                  <Typography variant="h4">
                    {analytics?.expiredLinks || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Clicks Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getClickHistoryData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Device Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getDeviceData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getDeviceData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Stack>

          {/* Links Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Links
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics?.urls?.map((url) => (
                    <TableRow key={url._id}>
                      <TableCell>{url.originalUrl}</TableCell>
                      <TableCell>{url.shortUrl}</TableCell>
                      <TableCell>{url.clicks}</TableCell>
                      <TableCell>
                        {new Date(url.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={url.expirationDate && new Date(url.expirationDate) < new Date() ? 'Expired' : 'Active'}
                          color={url.expirationDate && new Date(url.expirationDate) < new Date() ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
};

export default Analytics; 