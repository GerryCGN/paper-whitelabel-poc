import React from 'react';
import {
  mdiPaletteSwatch,
  mdiPalette,
  mdiCamera,
  mdiPlus,
  mdiPencil,
  mdiStar,
  mdiHeart,
  mdiCog,
  mdiEmail,
  mdiClose,
  mdiDotsVertical,
  mdiAccount,
  mdiAccountOutline,
  mdiWalk,
  mdiTrain,
  mdiCar,
  mdiFormatAlignLeft,
  mdiFormatAlignCenter,
  mdiFormatAlignRight,
  mdiInformation,
  mdiFolder,
  mdiBell,
  mdiBellOutline,
  mdiMenu,
  mdiContentCopy,
  mdiContentPaste,
  mdiDelete,
  mdiInbox,
  mdiSend,
  mdiHome,
  mdiHomeOutline,
  mdiCompass,
  mdiCompassOutline,
  mdiMagnify,
  mdiArchive,
  mdiAlert,
  mdiShape,
  mdiShapeOutline,
  mdiGestureTapButton,
  mdiGestureTap,
  mdiCard,
  mdiCardOutline,
  mdiEye,
  mdiEyeOff,
  mdiCheck,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBox,
  mdiRadioboxMarked,
  mdiRadioboxBlank,
  mdiArrowLeft,
  mdiArrowRight,
  mdiChevronUp,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiPageFirst,
  mdiPageLast,
} from '@mdi/js';

/**
 * Inline-SVG icon set for react-native-paper.
 *
 * Paper 5.15's default icon loader uses require() (unavailable in the browser),
 * so we supply our own icon via PaperProvider `settings`. Here we render each
 * icon as an inline <svg> using Material Design Icons path data from '@mdi/js'.
 * Only the icons listed below are imported, so the bundle stays small (no font,
 * no external requests).
 *
 * To add an icon: import its `mdiXxx` path from '@mdi/js' and add a
 * 'kebab-name': mdiXxx entry to PATHS.
 */
const PATHS = {
  'palette-swatch': mdiPaletteSwatch,
  palette: mdiPalette,
  camera: mdiCamera,
  plus: mdiPlus,
  pencil: mdiPencil,
  star: mdiStar,
  heart: mdiHeart,
  cog: mdiCog,
  email: mdiEmail,
  close: mdiClose,
  'dots-vertical': mdiDotsVertical,
  account: mdiAccount,
  'account-outline': mdiAccountOutline,
  walk: mdiWalk,
  train: mdiTrain,
  car: mdiCar,
  'format-align-left': mdiFormatAlignLeft,
  'format-align-center': mdiFormatAlignCenter,
  'format-align-right': mdiFormatAlignRight,
  information: mdiInformation,
  folder: mdiFolder,
  bell: mdiBell,
  'bell-outline': mdiBellOutline,
  menu: mdiMenu,
  'content-copy': mdiContentCopy,
  'content-paste': mdiContentPaste,
  delete: mdiDelete,
  inbox: mdiInbox,
  send: mdiSend,
  home: mdiHome,
  'home-outline': mdiHomeOutline,
  compass: mdiCompass,
  'compass-outline': mdiCompassOutline,
  magnify: mdiMagnify,
  archive: mdiArchive,
  alert: mdiAlert,
  shape: mdiShape,
  'shape-outline': mdiShapeOutline,
  'gesture-tap-button': mdiGestureTapButton,
  'gesture-tap': mdiGestureTap,
  card: mdiCard,
  'card-outline': mdiCardOutline,
  eye: mdiEye,
  'eye-off': mdiEyeOff,
  // Icons Paper uses internally for its controls:
  check: mdiCheck,
  'checkbox-marked': mdiCheckboxMarked,
  'checkbox-blank-outline': mdiCheckboxBlankOutline,
  'minus-box': mdiMinusBox,
  'radiobox-marked': mdiRadioboxMarked,
  'radiobox-blank': mdiRadioboxBlank,
  'arrow-left': mdiArrowLeft,
  'arrow-right': mdiArrowRight,
  'chevron-up': mdiChevronUp,
  'chevron-down': mdiChevronDown,
  'chevron-left': mdiChevronLeft,
  'chevron-right': mdiChevronRight,
  'page-first': mdiPageFirst,
  'page-last': mdiPageLast,
};

export function SvgIcon({ name, color = '#000', size = 24 }) {
  const path = PATHS[name];
  if (!path) {
    if (typeof console !== 'undefined') {
      console.warn(`[paperIcon] No inline SVG mapped for icon "${name}"`);
    }
    return null;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path d={path} fill={color} />
    </svg>
  );
}

export const paperSettings = {
  icon: ({ name, color, size }) => <SvgIcon name={name} color={color} size={size} />,
};

