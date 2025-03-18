import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
    return 1 + 2; 
  }`);

  const [review, setReview] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, [code]); // Ensure syntax highlighting updates when `code` changes.

  async function reviewCode() {
    try {
      const response = await axios.post(
        "https://code-review-pfvy.onrender.com/ai/get-review",
        { code }
      );
      setReview(response.data);
    } catch (error) {
      console.error("API Error:", error);
      setReview("⚠️ Error: Unable to fetch code review. Please try again.");
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={(newCode) => setCode(newCode)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <button onClick={reviewCode} className="review">Review</button>
      </div>
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
      </div>
    </main>
  );
}

export default App;
