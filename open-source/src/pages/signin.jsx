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
} from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import DefaultIcon from '../../components/common/icon/DefaultIcon';
import { ArrowLeft, ArrowLeftIcon, Home } from '../../res/icons/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import PasswordInput from '../../components/common/inputfields/PasswordInput';
import AuthLayout from '../../components/common/layout/AuthLayout';
import { SessionContext } from '../../lib/context/PublishedSession';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, publication, signOut } = useContext(SessionContext);

  // useEffect(() => {
  // 	if(publication) {
  // 		router.replace(publication.redirect_url)
  // 	}
  // 	if(!publication && user) {
  // 		router.replace('/posts')
  // 	}
  // }, [user, publication])

  const handleSignIn = async (values) => {
    setIsLoading(true);
    signIn({
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        console.log('signin', res);
        if (res.subdomain) router.replace('http://' + res.subdomain + '.' + process.env.NEXT_PUBLIC_DOMAIN + '/posts');
        else router.replace('/creator/create-publication');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSignOut = async () => {
    console.log('Sign out');
    const res = await signOut({
      redirect: false,
    });
    console.log(res);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: handleSignIn,
  });

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
        gap="24px"
      >
        <Typography align="center">
          You{"'"}re signed in as {publication.name}
        </Typography>
        <Button href={publication.redirect_url} variant="contained">
          Go to creator dashboard
        </Button>
        <Button variant="outlined" onClick={signOut}>
          Sign out
        </Button>
      </Stack>
    );

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
          Welcome Back
        </Typography>
        <Typography variant="text-lg-semibold" color="grayTrue.300" align="center">
          Sign in to continue
        </Typography>
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
        <Link href="/" passHref>
          <Typography
            variant="text-sm-medium"
            color="blueGray.700"
            sx={{
              cursor: 'pointer',
              alignSelf: 'end',
              width: 'fit-content',
            }}
          >
            Forgot password?
          </Typography>
        </Link>
        <Button
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
        <Link href="/creator/signup">
          <Typography
            variant="text-md-medium"
            sx={{
              cursor: 'pointer',
            }}
            alignSelf="center"
            color="grayTrue.600"
          >
            New to Published?
          </Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

SignIn.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignIn;
