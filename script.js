function toHalfWidth(str) {
  return str.replace(/[！-～]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  }).replace(/　/g, " ");
}

// あいまい検索でオイル情報を表示
function searchModel() { 
    const query = toHalfWidth(document.getElementById('modelInput').value.trim().toLowerCase());
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    if (!query) {
        alert("モデルを入力してください");
        return;
    }

    const results = [];

    for (const key in oilData.all_oil) {
        let model = oilData.all_oil[key].model;

        // ▼ 安全チェック（これがないとエラーになる）
        if (typeof model !== "string") continue;

        model = model.toLowerCase();

        if (model.includes(query)) {
            results.push(oilData.all_oil[key]);
        }
    }

    if (results.length === 0) {
        resultDiv.innerHTML = '<p class="no-results">該当するデータがありません。</p>';
        return;
    }

    // テーブル生成
    let html = '<table>';
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
}

document.getElementById("modelInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchModel();
  }
});
