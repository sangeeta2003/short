import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlService } from '../services/urlService';
import QRCode from 'qrcode.react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

const CreateLink = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newUrl = await urlService.shortenUrl(originalUrl);
      setCreatedLink(newUrl);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create New Link
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {createdLink ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Link Created Successfully!
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Short URL"
                  value={createdLink.shortUrl}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button
                        onClick={() => navigator.clipboard.writeText(createdLink.shortUrl)}
                        variant="outlined"
                        size="small"
                      >
                        Copy
                      </Button>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <QRCode value={createdLink.shortUrl} size={200} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Original URL"
                type="url"
                fullWidth
                margin="normal"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
                placeholder="https://example.com"
              />
              <TextField
                label="Custom Alias (optional)"
                fullWidth
                margin="normal"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-alias"
              />
              <TextField
                label="Expiration Date (optional)"
                type="date"
                fullWidth
                margin="normal"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Link'}
              </Button>
            </form>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateLink; 