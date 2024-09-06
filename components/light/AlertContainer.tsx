import React, { useState, ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Button, Icon as PaperIcon, Paragraph, Title as PaperTitle, useTheme } from 'react-native-paper';

type AlertContainerProps = {
  children: ReactNode;
};

type IconProps = {
  name?: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

type TitleProps = {
  text: string;
  textColor?: string;
  alignToCenter?: boolean;
  style?: StyleProp<TextStyle>;
};

type ContentProps = {
  children: ReactNode;
};

type ActionsProps = {
  children: ReactNode;
};

type ButtonProps = {
  text: string;
  textColor?: string;
  onPress: () => void;
};

const AlertContainer: React.FC<AlertContainerProps> & {
  Icon: React.FC<IconProps>;
  Title: React.FC<TitleProps>;
  Content: React.FC<ContentProps>;
  Actions: React.FC<ActionsProps>;
  AcceptButton: React.FC<ButtonProps>;
  DeclineButton: React.FC<ButtonProps>;
} = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const Icon: React.FC<IconProps> = ({ name = 'alert-outline', size = 24, color, style }) => {
  const theme = useTheme();
  return (
    <PaperIcon
      source={name}
      size={size}
      color={color || theme.colors.onBackground}
      style={[styles.icon, style]}
    />
  );
};

const Title: React.FC<TitleProps> = ({ text, textColor, alignToCenter = true, style }) => {
  const theme = useTheme();
  return (
    <PaperTitle
      style={[
        alignToCenter && styles.centerText,
        { color: textColor || theme.colors.onBackground },
        style,
      ]}
    >
      {text}
    </PaperTitle>
  );
};

const Content: React.FC<ContentProps> = ({ children }) => {
  return <Paragraph style={styles.content}>{children}</Paragraph>;
};

const Actions: React.FC<ActionsProps> = ({ children }) => {
  return <View style={styles.buttonContainer}>{children}</View>;
};

const AcceptButton: React.FC<ButtonProps> = ({ text, textColor, onPress }) => {
  const [hover, setHover] = useState(false);
  const theme = useTheme();

  return (
    <Button
      mode="text"
      style={[
        styles.button,
        {
          backgroundColor: hover ? theme.colors.elevation.level3 : 'transparent',
        },
      ]}
      textColor={textColor}
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={onPress}
    >
      {text}
    </Button>
  );
};

const DeclineButton: React.FC<ButtonProps> = ({ text, textColor, onPress }) => {
  const [hover, setHover] = useState(false);
  const theme = useTheme();

  return (
    <Button
      mode="text"
      style={[
        styles.button,
        {
          backgroundColor: hover ? theme.colors.errorContainer : 'transparent',
        },
      ]}
      textColor={hover ? theme.colors.onErrorContainer : theme.colors.error}
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={onPress}
    >
      {text}
    </Button>
  );
};

// Adding subcomponents to the AlertContainer
AlertContainer.Icon = Icon;
AlertContainer.Title = Title;
AlertContainer.Content = Content;
AlertContainer.Actions = Actions;
AlertContainer.AcceptButton = AcceptButton;
AlertContainer.DeclineButton = DeclineButton;

export default AlertContainer;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    padding: 0,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  centerText: {
    textAlign: 'center',
  },
  content: {
    padding: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 0,
  },
});
