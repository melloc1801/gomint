import { ElementTypeEnum, ListTypeEnum } from '../types/enums';

import { RenderElementProps } from 'slate-react';
import { SlateImage } from './SlateImage';
import { SlateImageProps } from '../types';
import get from 'lodash/get';

export const Element: React.FC<RenderElementProps | SlateImageProps> = (props) => {
  const { attributes, children, element } = props;

  const style = { textAlign: get(element, 'align') };
  switch (element.type) {
    case ElementTypeEnum.blockQuote:
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case ListTypeEnum.numberedList:
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case ListTypeEnum.bulletedList:
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case ElementTypeEnum.listItem:
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'image': {
      return <SlateImage {...(props as SlateImageProps)} />;
    }
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
