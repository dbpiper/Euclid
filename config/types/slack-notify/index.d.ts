declare module 'slack-notify' {
  interface FieldsShorthand {
    [key: string]: string;
  }

  interface Field {
    title: string;
    value: string;
    short: boolean;
  }

  interface Attachment {
    fallback: string;
    fields: Field[];
  }

  type Attachments = Attachment[];

  interface PostMessageOptions {
    text?: string;
    fields?: FieldsShorthand;
    attachments?: Attachments;
    channel?: string;
    username?: string;
    icon_emoji?: string;
    unfurl_links?: boolean | number;
    icon_url?: string;
  }

  type PostChatMessage = string | PostMessageOptions;
  type DoneCallback = (error: undefined | string | Error) => void;
  type SlackApiFunction = (
    textOrOptions: PostChatMessage,
    done?: DoneCallback,
  ) => void;

  interface SlackNotify {
    bug: SlackApiFunction;
    success: SlackApiFunction;
    alert: SlackApiFunction;
    note: SlackApiFunction;
    send: SlackApiFunction;
    onError: DoneCallback;
    extend: (
      options: PostMessageOptions,
      done?: DoneCallback,
    ) => SlackApiFunction;
  }

  type SlackNotifyConstructor = (slackWebhookUrl: string) => SlackNotify;
  const slackNotify: SlackNotifyConstructor;

  export default slackNotify;
}
