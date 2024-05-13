export function putTextInTextAreaElement(input?: HTMLTextAreaElement  , text: string = "") {
  if (!input) { return }

  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;

  // fallback
  if (!nativeTextAreaValueSetter) {
    input.value = text
    return
  }

  nativeTextAreaValueSetter.call(input, text)
  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event)
}