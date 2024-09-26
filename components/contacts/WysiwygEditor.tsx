import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";

interface WysiwygEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  onBlur?: () => void; // Optional onBlur prop
}

const WysiwygEditor: FC<WysiwygEditorProps> = ({
  content,
  setContent,
  onBlur,
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string>(""); // State for link URL
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State for popover visibility
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      // Set initial content if it has changed
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const saveSelection = () => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      return { range, selection };
    }

    return null;
  };

  const restoreSelection = (saved: { range: Range; selection: Selection }) => {
    const { range, selection } = saved;

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const savedSelection = saveSelection(); // Save cursor position

      setContent(editorRef.current.innerHTML);
      if (savedSelection) {
        setTimeout(() => restoreSelection(savedSelection), 0); // Restore cursor after content change
      }
    }
  };

  const updateFormattingStates = () => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateFormattingStates);

    return () => {
      document.removeEventListener("selectionchange", updateFormattingStates);
    };
  }, []);

  const handleAlignment = (align: string) => {
    document.execCommand(align);
    handleInput(); // Update content after alignment
  };

  return (
    <Card>
      <CardBody>
        <div className="flex space-x-2 mb-4">
          <Button
            isIconOnly
            color={isBold ? "primary" : "default"}
            size="sm"
            startContent={<i className="mdi mdi-format-bold text-xl" />}
            variant="faded"
            onClick={() => document.execCommand("bold")}
          />
          <Button
            isIconOnly
            color={isItalic ? "primary" : "default"}
            size="sm"
            startContent={<i className="mdi mdi-format-italic text-xl" />}
            variant="faded"
            onClick={() => document.execCommand("italic")}
          />
          <Button
            isIconOnly
            color={isUnderline ? "primary" : "default"}
            size="sm"
            startContent={<i className="mdi mdi-format-underline text-xl" />}
            variant="faded"
            onClick={() => document.execCommand("underline")}
          />

          <Popover
            isOpen={isPopoverOpen}
            onOpenChange={(open) => {
              if (open) saveSelection(); // Save selection before popover opens
              setIsPopoverOpen(open);
            }}
          >
            <PopoverTrigger>
              <Button
                isIconOnly
                size="sm"
                startContent={<i className="mdi mdi-link-variant text-xl" />}
                variant="solid"
              />
            </PopoverTrigger>
            <PopoverContent
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent text deselection
              }}
            >
              <div className="w-[250px] p-4">
                <Input
                  label="URL"
                  value={linkUrl}
                  variant="underlined"
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <Button
                  className="mt-2"
                  color="primary"
                  size="sm"
                  onClick={() =>
                    document.execCommand("createLink", false, linkUrl)
                  }
                >
                  Insert Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Select
            aria-label="Text Size"
            color="primary"
            placeholder="Select Text Size"
            size="sm"
            variant="faded"
            onChange={(e) =>
              document.execCommand("fontSize", false, e.target.value)
            }
          >
            <SelectItem key="text-xs" value="text-xs">
              X-Small
            </SelectItem>
            <SelectItem key="text-sm" value="text-sm">
              Small
            </SelectItem>
            <SelectItem key="text-md" value="text-md">
              Medium
            </SelectItem>
            <SelectItem key="text-lg" value="text-lg">
              Large
            </SelectItem>
            <SelectItem key="text-xl" value="text-xl">
              X-Large
            </SelectItem>
          </Select>

          {/* Alignment Buttons */}
          <Button
            isIconOnly
            size="sm"
            startContent={<i className="mdi mdi-format-align-left text-xl" />}
            variant="faded"
            onClick={() => handleAlignment("justifyLeft")}
          />
          <Button
            isIconOnly
            size="sm"
            startContent={<i className="mdi mdi-format-align-center text-xl" />}
            variant="faded"
            onClick={() => handleAlignment("justifyCenter")}
          />
          <Button
            isIconOnly
            size="sm"
            startContent={<i className="mdi mdi-format-align-right text-xl" />}
            variant="faded"
            onClick={() => handleAlignment("justifyRight")}
          />
          <Button
            isIconOnly
            size="sm"
            startContent={
              <i className="mdi mdi-format-align-justify text-xl" />
            }
            variant="faded"
            onClick={() => handleAlignment("justifyFull")}
          />
        </div>

        <div
          ref={editorRef}
          contentEditable
          className="wysiwyg"
          style={{
            height: "300px",
            padding: "15px",
            background: "#eeeeee",
            color: "black",
            borderRadius: "5px",
          }}
          onBlur={onBlur}
          onInput={handleInput}
        />
      </CardBody>
    </Card>
  );
};

export default WysiwygEditor;
