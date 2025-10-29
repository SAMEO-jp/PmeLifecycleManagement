#!/usr/bin/env node

/**
 * ESLintの結果を日本語に変換するカスタムフォーマッター
 * 
 * 使用方法:
 *   eslint --format ./eslint-formatter-japanese.js [ファイル...]
 * 
 * package.jsonのscriptsに追加例:
 *   "lint": "eslint --format ./eslint-formatter-japanese.js"
 */

// ESLintのメッセージ翻訳マップ
const messageTranslations = {
  // TypeScript ESLint
  "is assigned a value but never used": "使用されていません",
  "'{{name}}' is assigned a value but never used": "'{{name}}' は値が代入されていますが使用されていません",
  "is defined but never used": "定義されていますが使用されていません",
  "'{{name}}' is defined but never used": "'{{name}}' は定義されていますが使用されていません",
  
  // React Hooks
  "Cannot call impure function during render": "レンダー中に不純な関数を呼び出すことはできません",
  "Error: Cannot call impure function during render": "エラー: レンダー中に不純な関数を呼び出すことはできません",
  "is an impure function. Calling an impure function can produce unstable results that update unpredictably when the component happens to re-render": "は不純な関数です。不純な関数を呼び出すと、コンポーネントが再レンダーされると予測不可能な更新が発生する可能性があります",
  "is an impure function. Calling an impure function can produce unstable results": "は不純な関数です。不純な関数を呼び出すと、コンポーネントの再レンダー時に不安定な結果が発生する可能性があります",
  "that update unpredictably when the component happens to re-render": "コンポーネントが再レンダーされると予測不可能な更新が発生する可能性があります",
  "Cannot call impure function": "不純な関数を呼び出すことはできません",
  
  // 一般的なエラー
  "Unexpected any. Specify a different type.": "予期しないanyです。別の型を指定してください。",
  "Unexpected console statement.": "予期しないconsoleステートメントです。",
  "Using 'any' disables many type checking rules.": "'any'を使用すると、多くの型チェックルールが無効になります。",
  
  // ESLint基本ルール
  "Parsing error:": "解析エラー:",
  "Unexpected token": "予期しないトークン",
  "Missing semicolon": "セミコロンがありません",
  "Extra semicolon": "余分なセミコロン",
  
  // 追加の翻訳が必要な場合はここに追加
};

/**
 * メッセージを日本語に翻訳
 */
function translateMessage(message) {
  if (!message) return message;
  
  // 完全一致を確認
  if (messageTranslations[message]) {
    return messageTranslations[message];
  }
  
  // 部分一致を確認して置換（長いパターンから順にチェック）
  let translated = message;
  const sortedEntries = Object.entries(messageTranslations).sort((a, b) => b[0].length - a[0].length);
  
  for (const [enPattern, jaText] of sortedEntries) {
    // 変数を含むパターンの処理
    if (enPattern.includes('{{name}}')) {
      const regex = new RegExp(enPattern.replace(/{{name}}/g, '(.+?)'), 'g');
      const match = message.match(regex);
      if (match) {
        const varName = message.match(/'([^']+)'/)?.[1];
        if (varName) {
          translated = jaText.replace('{{name}}', varName);
          break;
        }
      }
    } else if (message.includes(enPattern)) {
      translated = translated.replace(enPattern, jaText);
    }
  }
  
  // 残っている英語の一般的なパターンを処理
  // コードブロック内の内容は保持（`...`で囲まれた部分）
  const parts = [];
  let lastIndex = 0;
  const codeBlockRegex = /`([^`]+)`/g;
  let match;
  
  while ((match = codeBlockRegex.exec(translated)) !== null) {
    // コードブロックの前の部分を処理
    if (match.index > lastIndex) {
      parts.push({
        text: translated.substring(lastIndex, match.index),
        isCode: false
      });
    }
    // コードブロックはそのまま保持
    parts.push({
      text: match[0],
      isCode: true
    });
    lastIndex = match.index + match[0].length;
  }
  
  // 残りの部分を追加
  if (lastIndex < translated.length) {
    parts.push({
      text: translated.substring(lastIndex),
      isCode: false
    });
  }
  
  // コードブロック以外の部分のみ翻訳を適用
  const processedParts = parts.length > 0 ? parts.map(part => {
    if (part.isCode) {
      return part.text;
    }
    return part.text
      .replace(/Error: /g, 'エラー: ')
      .replace(/Warning: /g, '警告: ')
      .replace(/\(https:\/\/[^)]+\)/g, '')
      .replace(/\. \.$/g, '.')
      .replace(/\s{2,}/g, ' ') // 連続する空白を1つに
      .trim();
  }) : [translated
    .replace(/Error: /g, 'エラー: ')
    .replace(/Warning: /g, '警告: ')
    .replace(/\(https:\/\/[^)]+\)/g, '')
    .replace(/\. \.$/g, '.')
    .replace(/\s{2,}/g, ' ')]; // 連続する空白を1つに
  
  return processedParts.join(' ').trim();
}

/**
 * ESLintの標準フォーマッター形式
 */
function format(results) {
  let output = '';
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalFixableErrors = 0;
  let totalFixableWarnings = 0;

  results.forEach(result => {
    const messages = result.messages;
    if (messages.length === 0) {
      return;
    }

    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;
    totalFixableErrors += result.fixableErrorCount;
    totalFixableWarnings += result.fixableWarningCount;

    output += `\n${result.filePath}\n`;
    
    messages.forEach(message => {
      const severity = message.severity === 2 ? 'エラー' : '警告';
      const line = message.line || 0;
      const column = message.column || 0;
      const ruleId = message.ruleId || '';
      
      // メッセージの前処理（改行やコードブロックを処理）
      let rawMessage = message.message || '';
      // 改行を削除して1行にまとめる
      rawMessage = rawMessage.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      
      // ファイルパスや行番号の参照を削除（既に表示されているため）
      rawMessage = rawMessage.replace(/\/[^:]+:\d+:\d+/g, '');
      // URLを削除（括弧内も含む、不完全なものも含む）
      rawMessage = rawMessage.replace(/\(https?:\/\/[^)]*\)/g, '');
      rawMessage = rawMessage.replace(/\(https?:\s*/g, '');
      rawMessage = rawMessage.replace(/https?:\/\/[^\s)]+/g, '');
      rawMessage = rawMessage.replace(/https?:\s*/g, '');
      // コードスニペット行を削除（既に表示されているため）
      rawMessage = rawMessage.replace(/\d+\s+\|\s+[^\n]+/g, '');
      rawMessage = rawMessage.replace(/>\s+\d+\s+\|\s+[^\n]+/g, '');
      // コメント行やコード行を削除（// で始まる行やreturn文など）
      rawMessage = rawMessage.replace(/\/\/ [^\n]+/g, '');
      rawMessage = rawMessage.replace(/const \w+ = [^;]+;/g, '');
      rawMessage = rawMessage.replace(/return `[^`]+`;/g, '');
      rawMessage = rawMessage.replace(/\}, \[\]\)/g, '');
      rawMessage = rawMessage.replace(/return \(/g, '');
      // ルールIDなどの残りの不要な部分を削除
      rawMessage = rawMessage.replace(/\s+react-hooks\/\w+/g, '');
      rawMessage = rawMessage.replace(/\.\s*$/g, ''); // 末尾の「. 」を削除
      
      // バッククォートやコードブロック内の内容を保持しつつ、メッセージを翻訳
      const translatedMessage = translateMessage(rawMessage);
      
      output += `  ${line}:${column}  ${severity}  ${translatedMessage}  ${ruleId}\n`;
      
      // コードスニペットの表示（メッセージに含まれていない場合）
      if (!rawMessage.includes('`') && result.source && line > 0) {
        const sourceLines = result.source.split('\n');
        const codeLine = sourceLines[line - 1];
        if (codeLine) {
          const indent = ' '.repeat(Math.max(0, column - 1));
          const endCol = message.endColumn || column + 1;
          const pointer = indent + '^' + '~'.repeat(Math.max(0, endCol - column - 1));
          output += `  ${codeLine}\n`;
          output += `  ${pointer}\n`;
        }
      }
    });
    
    output += '\n';
  });

  // サマリー
  if (results.length > 0) {
    output += '\n';
    if (totalErrors > 0 || totalWarnings > 0) {
      output += `✖ ${totalErrors + totalWarnings} 件の問題 (${totalErrors} エラー, ${totalWarnings} 警告)`;
      if (totalFixableErrors > 0 || totalFixableWarnings > 0) {
        output += `\n  ${totalFixableErrors + totalFixableWarnings} 件は自動修正可能`;
      }
      output += '\n';
    } else {
      output += '✓ 問題はありません\n';
    }
  }

  return output;
}

// ESLintフォーマッターとしてエクスポート
module.exports = format;
