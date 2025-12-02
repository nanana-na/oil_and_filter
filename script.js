function toHalfWidth(str) {
  str = str ?? ""; // nullやundefinedの場合は空文字に
  str = String(str); // 念のため文字列に変換
  return str.replace(/[！-～]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  }).replace(/　/g, " ");
}

// 初期フォントサイズを画面幅に応じて設定
function setDefaultFontSize() {
    const table = document.querySelector('#result table');
    if (!table) return;

    // 画面幅 768px 以下をスマホと判定
    const isMobile = window.innerWidth <= 768;
    const fontSize = isMobile ? '10px' : '13px';

    table.querySelectorAll('th, td').forEach(cell => {
        cell.style.fontSize = fontSize;
    });
}

// あいまい検索でオイル情報を表示
function searchModel() { 
    const query = toHalfWidth(document.getElementById('modelInput').value.trim()).toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    if (!query) {
        alert("モデルまたは車種を入力してください");
        return;
    }

    const results = [];

    for (const key in oilData.all_oil) {
        const item = oilData.all_oil[key];
        let model = item.model ?? "";
        let car = item.car ?? "";

        // 半角・小文字化
        model = toHalfWidth(model).toLowerCase();
        car = toHalfWidth(car).toLowerCase();

        if (model.includes(query) || car.includes(query)) {
            results.push(item);
        }
    }

    if (results.length === 0) {
        resultDiv.innerHTML = '<p class="no-results">該当するデータがありません。</p>';
        return;
    }

    // テーブル生成
    let html = '<table class="table_design">';
    html += `
        <tr>
            <th>車種</th>
            <th>型式</th>
            <th>純正オイル</th>
            <th>APIオイル</th>
            <th>オイル(L)</th>
            <th>+フィルター(L)</th>
            <th>ACデルコ品番</th>
            <th>純正部品番号</th>
        </tr>`;
    
    results.forEach(item => {
        html += `
            <tr>
                <td>${item.car ?? 'null'}</td>
                <td>${item.model ?? 'null'}</td>
                <td>${item.oil_type ?? 'null'}</td>
                <td>${item.oil_api ?? 'null'}</td>
                <td>${item.oil ?? 'null'}</td>
                <td>${item.filter_oil ?? 'null'}</td>
                <td>${item.ACDelco_number ?? 'null'}</td>
                <td>${item.part_number ?? 'null'}</td>
            </tr>`;
    });

    html += '</table>';
    resultDiv.innerHTML = html;

    // デフォルトフォントサイズを適用
    setDefaultFontSize();
}

document.getElementById("modelInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchModel();
  }
});
