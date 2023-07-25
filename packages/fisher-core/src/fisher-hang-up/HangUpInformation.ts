import { Information, information } from '../fisher-information';

class HangUpInformation {
  public static startLoading = (messages: string[] = []) => {
    const informations = messages.map((message) => new Information.NormalMessage(message));
    information.loading(true, informations);
  };

  public static stopLoading = () => {
    information.loading(false);
  };
}

export { HangUpInformation };
