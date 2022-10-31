import { Input, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const OtpInput = ({ value, setValue, ...others }) => {
  const [otp0, setOtp0] = useState('');
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');

  const inputRef0 = useRef();
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();

  const inputs = [
    {
      name: 'otp0',
      value: otp0,
      inputRef: inputRef0,
      setValue: (val) => setOtp0(val),
      focusNext: () => inputRef1.current.focus(),
      focusPrevious: () => {},
    },
    {
      name: 'otp1',
      value: otp1,
      inputRef: inputRef1,
      setValue: (val) => setOtp1(val),
      focusNext: () => inputRef2.current.focus(),
      focusPrevious: () => inputRef0.current.focus(),
    },
    {
      name: 'otp2',
      value: otp2,
      inputRef: inputRef2,
      setValue: (val) => setOtp2(val),
      focusNext: () => inputRef3.current.focus(),
      focusPrevious: () => inputRef1.current.focus(),
    },
    {
      name: 'otp3',
      value: otp3,
      inputRef: inputRef3,
      setValue: (val) => setOtp3(val),
      focusNext: () => {},
      focusPrevious: () => inputRef2.current.focus(),
    },
  ];

  const handleChange = (e, idx) => {
    if (e.key === 'Backspace') {
      inputs[idx].setValue('');
    }
    if (e.key === 'Backspace' && inputs[idx].value === '' && idx > 0) {
      inputs[idx - 1].setValue('');
      inputs[idx].focusPrevious();
    }
    if (/[0-9]/.test(e.key)) {
      inputs[idx].setValue(e.key);
      inputs[idx].focusNext();
    }
  };

  useEffect(() => {
    const otp = otp0 + otp1 + otp2 + otp3;
    setValue(otp);
  }, [otp0, otp1, otp2, otp3, setValue]);

  return (
    <Stack direction="row" justifyContent="space-between" gap="6px">
      {inputs.map((input, idx) => (
        <Input
          key={idx}
          name={input.name}
          value={input.value}
          inputRef={input.inputRef}
          onKeyUp={(e) => handleChange(e, idx)}
          sx={{
            height: '80px',
            fontFamily: 'Circular Std Medium',
            fontSize: '48px',
            lineHeight: '60px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'primary.600',
          }}
          inputProps={{
            style: {
              textAlign: 'center',
            },
          }}
        />
      ))}
    </Stack>
  );
};

export default OtpInput;
