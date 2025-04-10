import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Stack
} from '@mui/material';

const LinkAnalytics = () => {
  const { id } = useParams();
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const data = await urlService.getUrlAnalytics(id);
        setLinkData(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch link data');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkData();
  }, [id]);

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

  if (!linkData) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Link not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Link Analytics
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Link Details
              </Typography>
              <Typography>
                <strong>Original URL:</strong> {linkData.originalUrl}
              </Typography>
              <Typography>
                <strong>Short URL:</strong> {linkData.shortUrl}
              </Typography>
              <Typography>
                <strong>Created:</strong> {new Date(linkData.createdAt).toLocaleDateString()}
              </Typography>
              {linkData.expirationDate && (
                <Typography>
                  <strong>Expires:</strong> {new Date(linkData.expirationDate).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Click Statistics
              </Typography>
              <Typography variant="h3" color="primary">
                {linkData.clicks}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {linkData.clicks > 0 && linkData.clickHistory && (
          <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Click History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>User Agent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {linkData.clickHistory.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(click.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{click.ip}</TableCell>
                      <TableCell>{click.userAgent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default LinkAnalytics; 