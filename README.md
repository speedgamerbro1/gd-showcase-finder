# Geometry Dash Showcase Finder

A lightweight web tool for finding YouTube showcases from **Geometry Dash level** IDs using the **Level Showcases** mod dataset.

This project maps GD level IDs to YouTube video IDs like this:


```json
"92323413": "58aw2Y-e-sk"
```

Then it automatically builds the full YouTube link:

```
https://www.youtube.com/watch?v=58aw2Y-e-sk
```

---

## ⭐ Features

- **🔍 Search by level ID**
- **📺 Embedded YouTube video**  
- **🔗 Clickable YouTube link**  
- **📋 Copy link button**  
- **⭐ Favorite levels saved in local storage**  
- **🎲 Random level picker**
- **⏳ Loading status indicator**  
- **🧠 Suggestions and closest matches for invalid IDs**  
- **🧑‍💻 Clean UI with responsive layout**


---

## 📁 Project Structure

```
/gd-showcase-finder
├─ index.html
├─ styles.css
├─ script.js
├─ showcases.json
└─ README.md
```
---

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/YourUsername/gd-showcase-finder.git
```
Open index.html in your browser.

**⚠️ The app reads showcases.json locally, so it works best when served via a local server.**

**🧩 Usage:**

Open the app in your browser.

Enter a **Geometry Dash Level ID.**

Click Search.

If found, the YouTube link and video will appear.

Click *⭐ Favorite to* save the level to your favorites list.

Use **Random** to explore random showcases.

**🧾 Credits:**

Level mapping data from the Geometry Dash **Level Showcases** mod

Built with plain HTML, CSS, and JavaScript

**📝 License:**

This project is released under the **MIT License.**