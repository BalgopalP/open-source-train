import {
  Alert,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  Input,
  InputLabel,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';
import fileSize from 'filesize';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import FeaturedIcon from '../../components/common/icon/FeaturedIcon';
import AuthLayout from '../../components/common/layout/AuthLayout';
import { File, UploadCloud } from '../../res/icons/icons';
import api from '../../lib/utils/axios/auth';
import { SessionContext } from '../../lib/context/PublishedSession';

const humanReadableSize = fileSize.partial();

const CreatePublication = () => {
  // const {data: session, status} = useSession()
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const router = useRouter();
  const { status, publication } = useContext(SessionContext);
  // console.log(cValue)

  // console.log(session)

  const createPublication = (values) => {
    setIsLoading(true);
    const payload = {
      ...values,
      logo: logo,
    };
    console.log('payload', payload);
    api.publication
      .create(payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            let currentProgress = (progressEvent.loaded / progressEvent.total) * 100;
            setFileUploadProgress(currentProgress);
          }
        },
      })
      .then((data) => {
        console.log(data);
        router.replace(`https://${data.subdomain}.${process.env.DOMAIN}`);
      })
      .catch((err) => {
        console.log('error', err);
        setError(Object.values(err)[0]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      subdomain: '',
    },
    onSubmit: createPublication,
  });

  const handleLogo = (e) => {
    const file = e.target.files[0];
    console.log('file', file);
    setLogo(file);
  };

  if (status !== 'unauthenticated')
    return (
      <Stack
        sx={{
          padding: '112px 32px',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderColor: 'grayIron.200',
          width: '100%',
          maxWidth: 522,
          margin: '0 auto',
          flexGrow: 1,
        }}
        justifyContent="center"
        gap="16px"
      >
        <Typography variant="display-sm-medium" align="center">
          Authentication required
        </Typography>
        <Stack direction="row" gap="16px" justifyContent="space-between">
          <Button href="/auth/signup" variant="contained" fullWidth>
            <Typography variant="text-md-medium">Sign up</Typography>
          </Button>
          <Button href="/auth/signin" variant="outlined" fullWidth>
            <Typography variant="text-md-medium">Sign in</Typography>
          </Button>
        </Stack>
      </Stack>
    );

  if (publication)
    return (
      <Stack
        sx={{
          padding: '112px 32px',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderColor: 'grayIron.200',
          width: '100%',
          maxWidth: 522,
          margin: '0 auto',
          flexGrow: 1,
        }}
        justifyContent="center"
        gap="16px"
      >
        <Typography variant="display-sm-medium">You already have a publication</Typography>
      </Stack>
    );

  return (
    <Stack
      sx={{
        padding: '32px 32px',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderColor: 'grayIron.200',
        width: '100%',
        maxWidth: 522,
        margin: '0 auto',
        flexGrow: 1,
      }}
      justifyContent="center"
      gap="16px"
    >
      <Typography variant="display-sm-semi-bold" align="center">
        Create Publication
      </Typography>
      <Collapse in={error ? true : false}>
        <Alert severity="error">{error}</Alert>
      </Collapse>
      <FormControl>
        <InputLabel required>
          <Typography variant="text-sm-medium" color="grayIron.700">
            Publication logo
          </Typography>
        </InputLabel>
        <Button
          component="label"
          variant="outlined"
          sx={{
            padding: '16px 24px',
            borderColor: 'grayIron.200',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            '&:hover': {
              borderColor: 'grayIron.200',
            },
          }}
        >
          <Input
            type="file"
            inputProps={{
              accept: '.png,.jpg',
            }}
            sx={{
              display: 'none',
            }}
            onChange={handleLogo}
          />
          <FeaturedIcon icon={UploadCloud} width={20} stroke="grayIron.600" />
          <Stack gap="4px" alignItems="center">
            <Typography variant="text-sm-medium" color="grayIron.700">
              Click to upload
              <Typography variant="text-sm-normal" color="grayIron.500">
                {' '}
                or drag and drop
              </Typography>
            </Typography>
            <Typography variant="text-xs-normal" color="grayIron.500">
              {'SVG, PNG, JPG or GIF (max. 800x400px)'}
            </Typography>
          </Stack>
        </Button>
      </FormControl>
      {logo && (
        <Stack
          direction="row"
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'grayIron.600',
            borderRadius: '8px',
            padding: '14px',
          }}
          gap="16px"
        >
          <FeaturedIcon icon={File} width={16} stroke="grayIron.600" />
          <Stack
            sx={{
              width: '100%',
            }}
          >
            <Stack direction="row">
              <Typography
                variant="text-sm-medium"
                sx={{
                  flexGrow: 1,
                }}
              >
                {logo.name}
              </Typography>
              {/* { fileUploadState==='success' && <CheckSuccess width={16} /> } */}
            </Stack>
            <Typography variant="text-sm-normal" color="grayIron.500">
              {humanReadableSize(logo.size)}
            </Typography>
            <Stack direction="row" alignItems="center">
              <LinearProgress
                variant="determinate"
                value={fileUploadProgress}
                sx={{
                  flexGrow: 1,
                  height: '8px',
                  backgroundColor: 'transparent',
                  marginRight: '12px',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'moss.300',
                    borderRadius: '4px',
                  },
                }}
              />
              <Typography variant="text-sm-medium">{fileUploadProgress > 0 ? fileUploadProgress + '%' : ''}</Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
      <FormControl>
        <InputLabel required>
          <Typography variant="text-sm-medium" color="grayIron.700">
            Publication name
          </Typography>
        </InputLabel>
        <Input name="name" value={formik.values.name} onChange={formik.handleChange} required />
      </FormControl>
      <FormControl>
        <InputLabel required>
          <Typography variant="text-sm-medium" color="grayIron.700">
            Description
          </Typography>
        </InputLabel>
        <Input
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          required
          multiline
          rows={3}
        />
      </FormControl>
      <FormControl>
        <InputLabel required>
          <Typography variant="text-sm-medium" color="grayIron.700">
            Website
          </Typography>
        </InputLabel>
        <Input
          name="subdomain"
          value={formik.values.subdomain}
          onChange={formik.handleChange}
          required
          sx={{
            padding: 0,
          }}
          inputProps={{
            style: {
              padding: '14px 16px',
            },
          }}
          endAdornment={
            <Typography
              variant="text-sm-medium"
              sx={{
                padding: '14px 16px',
                borderLeft: '1px solid',
                borderColor: 'grayTrue.300',
              }}
            >
              .onpublished.com
            </Typography>
          }
        />
      </FormControl>
      <Button
        variant="contained"
        sx={{
          padding: '10px 18px',
        }}
        onClick={formik.handleSubmit}
      >
        <Typography variant="text-md-medium">
          {!isLoading ? 'Continue' : <CircularProgress size="16px" color="white" />}
        </Typography>
      </Button>
    </Stack>
  );
};

CreatePublication.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default CreatePublication;
