import { ErrorStackFrames, ErrorStackInfo } from '@eagle-tracker/types';

// 正则表达式，用以解析堆栈split后得到的字符串
const FULL_MATCH = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

// 解析每一行
function parseStackLine(line: string): ErrorStackInfo {
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch) return {} as ErrorStackInfo;
  const filename = lineMatch[2];
  const functionName = lineMatch[1] || '';
  const lineNumber = parseInt(lineMatch[3], 10) || -1;
  const columnNumber = parseInt(lineMatch[4], 10) || -1;
  return {
    filename,
    functionName,
    lineNumber,
    columnNumber,
  };
}

// 解析错误堆栈
export default function parseStackFrames(error: Error) {
  const { stack } = error;
  // 无 stack 时直接返回
  if (!stack) return [];
  const frames: ErrorStackFrames = [];
  const errorStrings = stack.split('\n').slice(1);
  errorStrings.forEach((line) => {
    const frame = parseStackLine(line);
    if (frame) {
      frames.push(frame);
    }
  });
  return frames;
}
