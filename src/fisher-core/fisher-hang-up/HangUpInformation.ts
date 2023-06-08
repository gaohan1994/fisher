import { Information, informationLoading } from '../fisher-information';

class HangUpInformation {
  public static startLoading = (messages: string[] = []) => {
    const informations = messages.map((message) => new Information.NormalMessage(message));
    informationLoading(true, informations);
  };

  public static stopLoading = () => {
    informationLoading(false);
  };
}

export { HangUpInformation };
