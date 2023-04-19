import 'material-icons/iconfont/material-icons.css';

import {
  ButtonIcons,
  ElementTypeEnum,
  ListTypeEnum,
  MarkTypeEnum,
  TextAlignTypes,
} from './types/enums';
import { Descendant, createEditor } from 'slate';
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';
import React, { KeyboardEventHandler } from 'react';

import { BlockButton } from './components/BlockButton';
import { Element } from './components/Element';
import { InsertImageButton } from './components/InsertImageButton';
import { Leaf } from './components/Leaf';
import { MarkButton } from './components/MarkButton';
import debounce from 'lodash/debounce';
import isHotkey from 'is-hotkey';
import { toggleMark } from './utils/toggleMark';
import { withHistory } from 'slate-history';
import { withImages } from './hoc/withImages';

interface EditorProps {
  label?: string;
  textData?: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const initialValue: Descendant[] = [
  {
    type: ElementTypeEnum.paragraph,
    children: [{ text: '', bold: undefined }],
  },
];

export const HOTKEYS: { [hotkey: string]: MarkTypeEnum } = {
  'mod+b': MarkTypeEnum.bold,
  'mod+i': MarkTypeEnum.italic,
  'mod+u': MarkTypeEnum.underline,
};

export const Editor: React.FC<EditorProps> = ({ textData = initialValue, onChange }) => {
  onChange = debounce(onChange, 200);
  const renderLeaf = React.useCallback<(props: RenderLeafProps) => JSX.Element>(
    (props) => <Leaf {...props} />,
    []
  );
  const renderElement = React.useCallback<(props: RenderElementProps) => JSX.Element>(
    (props) => <Element {...props} />,
    []
  );
  const editor = React.useMemo(() => withImages(withHistory(withReact(createEditor()))), []);
  const onKeyDown = React.useCallback<KeyboardEventHandler<HTMLDivElement>>(
    (event) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
        }
      }
    },
    [editor]
  );

  return (
    <Slate editor={editor} value={textData.length ? textData : initialValue} onChange={onChange}>
      <ul className="flex flex-wrap px-4 pt-2 pb-0.5 border rounded-t text-slate-400 bg-gray-50">
        <li className="mr-3">
          <MarkButton format={MarkTypeEnum.bold} icon={ButtonIcons.formatBold} />
        </li>
        <li className="mr-3">
          <MarkButton format={MarkTypeEnum.italic} icon={ButtonIcons.formatItalic} />
        </li>
        <li className="mr-3">
          <MarkButton format={MarkTypeEnum.underline} icon={ButtonIcons.formatUnderlined} />
        </li>
        <li className="mr-3">
          <BlockButton format={TextAlignTypes.left} icon={ButtonIcons.left} />
        </li>
        <li className="mr-3">
          <BlockButton format={TextAlignTypes.center} icon={ButtonIcons.center} />
        </li>
        <li className="mr-3">
          <BlockButton format={TextAlignTypes.right} icon={ButtonIcons.right} />
        </li>
        <li className="mr-3">
          <BlockButton format={TextAlignTypes.justify} icon={ButtonIcons.justify} />
        </li>
        <li className="mr-3">
          <BlockButton format={ListTypeEnum.numberedList} icon={ButtonIcons.numberedList} />
        </li>
        <li className="mr-3">
          <BlockButton format={ListTypeEnum.bulletedList} icon={ButtonIcons.bulletedList} />
        </li>
        <li>
          <InsertImageButton />
        </li>
      </ul>
      <div className="bg-white border border-t-0 rounded-b">
        <Editable
          spellCheck
          className="p-2"
          onKeyDown={onKeyDown}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
        />
      </div>
    </Slate>
  );
};
