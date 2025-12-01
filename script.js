function toHalfWidth(str) {
  return str.replace(/[！-～]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  }).replace(/　/g, " "); // 全角スペースも半角に
}

// あいまい検索でオイル情報を表示する関数
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
        const model = oilData.all_oil[key].model.toLowerCase();
        if (model.includes(query)) {  // 部分一致
            results.push(oilData.all_oil[key]);
        }
    }

    if (results.length === 0) {
        resultDiv.innerHTML = '<p class="no-results">該当するデータがありません。</p>';
        return;
    }

    // テーブル作成
    let html = '<table>';
    html += `<tr>
                <th>車種</th>
                <th>型式</th>
                <th>純正オイル</th>
                <th>オイル(L)</th>
                <th>+フィルター(L)</th>
                <th>純正部品番号</th>
                <th>ACデルコ品番</th>
             </tr>`;
    results.forEach(item => {
        html += `<tr>
                    <td>${item.car}</td>
                    <td>${item.model}</td>
                    <td>${item.oil_type}</td>
                    <td>${item.oil}</td>
                    <td>${item.filter_oil}</td>
                    <td>${item.part_number !== null ? item.part_number : 'null'}</td>
                    <td>${item.ACDelco_number !== null ? item.ACDelco_number : 'null'}</td>
                 </tr>`;
    });
    html += '</table>';

    resultDiv.innerHTML = html;
}

document.getElementById("modelInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();   // iPhoneでの勝手な改行を防ぐ
    searchModel();
  }
});