import { FisherInformationVariant } from './Constants';
import { InformationMessage } from './Message';

class FisherInformationMessageHandler {
  public id: number;

  public informationVariant: FisherInformationVariant;

  public get isAlertVariant() {
    return this.informationVariant === FisherInformationVariant.Alert;
  }

  public get isTipVariant() {
    return this.informationVariant === FisherInformationVariant.Tip;
  }

  public messages: InformationMessage[] = [];

  constructor(id: number, informationVariant: FisherInformationVariant, messages: InformationMessage[]) {
    this.id = id;
    this.informationVariant = informationVariant;
    this.messages = messages;
  }
}

export { FisherInformationMessageHandler };
