export const UI_CLASS_NAMES = {
  container: 'ui-container',
  section: 'ui-section',
  card: 'ui-card',
  button: 'ui-button',
  buttonPrimary: 'ui-button ui-button--primary',
  buttonGhost: 'ui-button ui-button--ghost',
  eyebrow: 'ui-eyebrow',
  copy: 'ui-copy',
  stackSm: 'ui-stack-sm',
  stackMd: 'ui-stack-md',
  stackLg: 'ui-stack-lg',
  loading: 'ui-loading',
} as const;

export type UiClassNameKey = keyof typeof UI_CLASS_NAMES;
export type UiClassName = (typeof UI_CLASS_NAMES)[UiClassNameKey];