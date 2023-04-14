import Message from "@/components/element/message";
import MessageBox from "@/components/element/message-box";

export class MessageUtil {
  static $message(opts) {
    const { type, ...rest } = opts;
    return Message[type]({
      ...rest,
    });
  }

  static $confirm(...p) {
    return MessageBox.confirm(...p);
  }
}
