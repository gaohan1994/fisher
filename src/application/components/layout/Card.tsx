import { Card, CardContent, CardHeader, CardProps, styled } from '@mui/material';
import { FuiColor } from '../theme';
import { CardHeaderText } from './Text';

interface IModuleCard extends Omit<CardProps, 'title'> {
  title?: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  backgroundColor?: string;
}
export const ModuleCard = styled(
  ({ header = null, title = null, actions = null, backgroundColor = undefined, children, ...rest }: IModuleCard) => (
    <Card id="module-card" {...rest}>
      {header}
      {title !== null && (
        <CardHeader title={typeof title === 'string' ? <CardHeaderText>{title}</CardHeaderText> : title} />
      )}
      <CardContent id="module-card-content">{children}</CardContent>
      {actions}
    </Card>
  )
)(({ backgroundColor }) => ({
  backgroundColor: backgroundColor || FuiColor.primary.background,
}));

const AppbarHeight = 64;
const AppContentSpce = 20;
/**
 * Wrap ModuleCard and build ModuleStickyCard
 */
export const ModuleStickyCard = styled(({ ...rest }: IModuleCard) => <ModuleCard {...rest} />)(() => ({
  position: 'sticky',
  top: AppbarHeight + AppContentSpce,
}));
