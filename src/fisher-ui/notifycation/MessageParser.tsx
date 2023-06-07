import React from 'react';
import dayjs from 'dayjs';
import {
  ExperienceMessage,
  Information,
  InformationMessage,
  ItemMessage,
  MasterDeathMessage,
  MasterLevelMessage,
  NormalMessage,
} from '@FisherCore';
import { Divider, Typography } from '@mui/material';
import { FuiItemName } from '../item';

class MessageParer {
  public static parserItemMessage = ({ key, message }: ItemMessage) => {
    const { prefix, item, quantity } = message;
    const verb = quantity > 0 ? '获得了' : '失去了';
    return (
      <Typography variant="caption" key={key} color="white">
        {prefix}
        {verb}
        <FuiItemName item={item} variant="caption" sx={{ ml: 1, mr: 1 }} />
        数量：{quantity}
      </Typography>
    );
  };

  public static parserExperienceMessage = ({ key, message }: ExperienceMessage) => {
    const { prefix, experience } = message;
    const verb = experience > 0 ? '获得了' : '失去了';
    return (
      <Typography variant="caption" key={key} color="white">
        {prefix}
        {verb}
        <Typography color="secondary" variant="caption" sx={{ ml: 1, mr: 1 }}>
          {experience}
        </Typography>
        经验值
      </Typography>
    );
  };

  public static parserMasterDeathMessage = ({ key, message }: MasterDeathMessage) => {
    const { prefix } = message;
    return (
      <Typography variant="caption" key={key} color="error">
        {prefix}死了
      </Typography>
    );
  };

  public static parserMasterLevelMessage = ({ key, message }: MasterLevelMessage) => {
    const { prefix, beforeLevel, level } = message;
    const isLevelUp = level > beforeLevel;
    const verb = isLevelUp ? '等级提升到了' : '等级降低到了';
    const color = isLevelUp ? 'secondary' : 'error';
    return (
      <Typography variant="caption" key={key} color={color}>
        {prefix}
        {verb}
        <Typography variant="caption" color={color} sx={{ ml: 1, mr: 1 }}>
          {level}
        </Typography>
        级
      </Typography>
    );
  };

  public static parserNormalMessage = ({ key, message }: NormalMessage) => {
    const { color } = message;
    return (
      <Typography variant="caption" key={key} color={color ?? 'white'}>
        {message.message}
      </Typography>
    );
  };

  public source: InformationMessage[];

  public date: string;

  constructor(messages: InformationMessage[]) {
    this.source = messages;
    this.date = dayjs().format('MM-DD HH:mm');
  }

  public toMessage = () => {
    let result: React.ReactNode[] = [];

    this.source.forEach((message, index, array) => {
      if (Information.isItemMessage(message)) {
        result.push(MessageParer.parserItemMessage(message));
      }

      if (Information.isExperienceMessage(message)) {
        result.push(MessageParer.parserExperienceMessage(message));
      }

      if (Information.isMasterDeathMessage(message)) {
        result.push(MessageParer.parserMasterDeathMessage(message));
      }

      if (Information.isMasterLevelMessage(message)) {
        result.push(MessageParer.parserMasterLevelMessage(message));
      }

      if (Information.isNormalMessage(message)) {
        result.push(MessageParer.parserNormalMessage(message));
      }

      if (index !== array.length - 1) {
        result.push(<Divider key={message.key + 'divider'} />);
      }
    });

    return result;
  };
}

export { MessageParer };
