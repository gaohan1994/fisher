import { Dialog, DialogProps, styled } from '@mui/material';

interface IConfirmDialog extends DialogProps {}
export const ConfirmDialog = styled(({ ...rest }: IConfirmDialog) => <Dialog {...rest} />)(() => ({}));
