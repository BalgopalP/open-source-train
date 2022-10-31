import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Input,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Checkbox,
  Collapse,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import DefaultIcon from '../../components/common/icon/DefaultIcon';
import { ArrowLeft, ArrowLeftIcon, Home, Mail } from '../../res/icons/icons';
// import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import PasswordInput from '../../components/common/inputfields/PasswordInput';
// import { AuthServer } from '../../services/auth'
import FeaturedIcon from '../../components/common/icon/FeaturedIcon';
import OtpInput from '../../components/common/inputfields/OtpInput';
import AuthLayout from '../../components/common/layout/AuthLayout';
import api from '../../lib/utils/axios/auth';
import { SessionContext } from '../../lib/context/PublishedSession';

const SignUp = () => {
  const [error, setError] = useState();
  const [info, setInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTnC, setAgreedTnC] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const router = useRouter();

  const { signIn } = useContext(SessionContext);

  const handleSignUp = async (values) => {
    setError('');
    setIsLoading(true);
    setEmail(values.email);
    const user = {
      email: values.email,
      password1: values.password,
      password2: values.password,
    };
    console.log(user);
    api.user
      .signup(user)
      .then((data) => {
        setStep(2);
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
      email: '',
      password: '',
    },
    onSubmit: handleSignUp,
  });

  const toggleTnC = () => {
    setAgreedTnC(!agreedTnC);
  };

  const resendCode = () => {
    setInfo('');
    console.log('resend to', email);
    AuthServer.get('rest-auth/otp/verify/?email=' + email)
      .then((res) => {
        console.log(res.data);
        setInfo(res.data);
      })
      .catch((err) => {
        setError(err.response.data.Msg);
      });
  };

  const verifyOtp = () => {
    setIsLoading(true);
    setInfo('');
    const payload = {
      email,
      otp,
    };
    console.log(payload);
    api.user
      .verifyOtp(payload)
      .then((data) => {
        console.log(data);
        return signIn({
          email: formik.values.email,
          password: formik.values.password,
        });
      })
      .then((res) => {
        router.replace('/creator/create-publication');
      })
      .catch((err) => {
        console.log(err);
        setError(Object.values(err)[0]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (step === 1)
    return (
      <Stack
        sx={{
          padding: '0px 32px',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderColor: 'grayIron.200',
          width: '100%',
          maxWidth: 522,
          margin: '0 auto',
          height: '100%',
        }}
        justifyContent="center"
      >
        <Stack gap="16px">
          <Button
            startIcon={<DefaultIcon icon={ArrowLeft} stroke="grayTrue.800" width={20} />}
            sx={{
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'grayIron.100',
              width: 'fit-content',
            }}
          >
            <Typography variant="text-sm-normal">Go back</Typography>
          </Button>
          <Stack padding={'12px 24px'} alignItems="center">
            <Box
              component="img"
              src="/logo/Logomark.svg"
              sx={{
                width: '80px',
              }}
            />
          </Stack>
          <Typography variant="display-sm-medium" align="center">
            Create an account
          </Typography>
          <Typography variant="text-lg-semibold" color="grayTrue.300" align="center">
            Start for free
          </Typography>
          <Collapse in={error ? true : false}>
            <Alert severity="error">{error}</Alert>
          </Collapse>
          <FormControl>
            <Input
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl>
            <PasswordInput
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </FormControl>
          <Stack direction="row" alignItems="center" gap="8px">
            <Checkbox
              checked={agreedTnC}
              onChange={toggleTnC}
              sx={{
                '& .MuiSvgIcon-root': {
                  fill: agreedTnC ? '#344054' : '#D0D5DD',
                },
              }}
            />
            <InputLabel
              sx={{
                display: 'flex',
              }}
            >
              <Typography variant="text-sm-medium" color="grayTrue.700">
                I agree to{' '}
                <Link href="/tnc" passHref>
                  <Typography
                    component="a"
                    variant="text-sm-medium"
                    color="grayTrue.700"
                    sx={{
                      textDecoration: 'underline',
                    }}
                  >
                    Terms and Conditions
                  </Typography>
                </Link>
              </Typography>
            </InputLabel>
          </Stack>
          <Button
            disabled={!agreedTnC}
            variant="contained"
            fullWidth
            sx={{
              padding: '10px 18px',
              backgroundColor: 'grayTrue.800',
            }}
            onClick={formik.handleSubmit}
          >
            <Typography variant="text-md-medium">
              {!isLoading ? 'Continue' : <CircularProgress size="16px" color="white" />}
            </Typography>
          </Button>
          <Link href="/creator/signin">
            <Typography
              variant="text-md-medium"
              sx={{
                cursor: 'pointer',
              }}
              alignSelf="center"
              color="grayTrue.600"
            >
              Already have an account?
            </Typography>
          </Link>
        </Stack>
      </Stack>
    );

  if (step === 2)
    return (
      <Stack
        sx={{
          padding: '0px 32px',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderColor: 'grayIron.200',
          width: '100%',
          maxWidth: 522,
          margin: '0 auto',
          height: '100%',
        }}
        justifyContent="center"
        gap="16px"
      >
        <Stack gap="24px" alignItems="center">
          <FeaturedIcon icon={Mail} width={24} />
          <Typography variant="display-sm-semi-bold" color="grayIron.900">
            Verify your email
          </Typography>
        </Stack>
        <Collapse in={info || error}>
          <Alert severity={info ? 'info' : 'error'}>{info || error}</Alert>
        </Collapse>
        <Stack padding="24px 48px" gap="32px">
          <Stack gap="20px">
            <Typography variant="text-sm-normal" color="gray.500" align="center">
              We{"'"}ve sent a code to {email}
            </Typography>
            <Stack gap="6px">
              <OtpInput value={otp} setValue={setOtp} />
              <Typography
                variant="text-sm-normal"
                color="gray.500"
                onClick={resendCode}
                sx={{
                  cursor: 'pointer',
                }}
              >
                Didn{"'"}t get a code?{' '}
                <Typography
                  variant="text-sm-normal"
                  color="gray.500"
                  sx={{
                    textDecoration: 'underline',
                  }}
                >
                  Click to resend.
                </Typography>
              </Typography>
            </Stack>
          </Stack>
          <Button variant="contained" onClick={verifyOtp}>
            <Typography variant="text-md-medium">
              {!isLoading ? 'Verify' : <CircularProgress size="16px" color="white" />}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    );
};

SignUp.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignUp;
