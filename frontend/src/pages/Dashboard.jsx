import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { urlService } from '../services/urlService';

const Dashboard = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const data = await urlService.getMyUrls();
      setUrls(data);
    } catch (err) {
      setError('Failed to fetch URLs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newUrl = await urlService.shortenUrl(originalUrl);
      setUrls([newUrl, ...urls]);
      setOriginalUrl('');
      setSuccess('URL shortened successfully!');
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Shorten a URL
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Enter URL"
              fullWidth
              margin="normal"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
        </Paper>

        <Typography variant="h5" gutterBottom>
          Your URLs
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Original URL</TableCell>
                <TableCell>Short URL</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <TableRow key={url._id}>
                  <TableCell>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {url.shortUrl}
                      </a>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(url.shortUrl)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{url.clicks}</TableCell>
                  <TableCell>
                    {new Date(url.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      href={`/analytics/${url._id}`}
                    >
                      View Analytics
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard; 