import {
  FoundationInfoOptions,
  FoundationInfoProvider,
} from "../providers/foundation-info-provider.model";

export class FoundationInfoParser extends FoundationInfoProvider {
  constructor(sections: FoundationInfoOptions) {
    super(sections);
  }
}
