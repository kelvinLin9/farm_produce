let data = []
let showData = []
let searchName = ''
let type = ''
let sort = ''
let upDown = ''

function getData() {
  axios
    .get("https://hexschool.github.io/js-filter-data/data.json")
    .then((res) => {
      data = res.data.filter((i) => i["種類代碼"] && i["作物名稱"].trim())
      data = data.filter((i) => i["交易量"] !== 0)
      render(showData)
    });
}
getData();

const showList = document.querySelector('.showList')
const showResult = document.querySelector('.show-result')
const buttonGroup = document.querySelector('.button-group')
const buttonGroups = document.querySelectorAll('.button-group button')
const searchInput = document.querySelector('.rounded-end')
const searchBtn = document.querySelector('.search')
const sortSelect = document.querySelector('.sort-select')
const sortAdvanced = document.querySelector('.js-sort-advanced')
const sortBtn = document.querySelectorAll('.js-sort-advanced i')

function render(showData) {
  let str = ''
  if (showData.length === 0 && searchName === ''){
    str = `
    <td colspan="7" class="text-center p-3">
      請輸入並搜尋想比價的作物名稱^＿^
    </td>
    `
  }else if(showData.length === 0 && searchName !== '') {
    str = `
    <td colspan="7" class="text-center p-3">
      查詢不到當日交易資訊Ｑ＿Ｑ
    </td>
    `
    showResult.innerHTML = `查看${searchName || type}的比價結果，共${showData.length}筆資料`
  } else {
    showData.forEach((item) => {
      str += `
      <tr>
        <td>${item["作物名稱"]}</td>
        <td>${item["市場名稱"]}</td>
        <td>${item["上價"]}</td>
        <td>${item["中價"]}</td>
        <td>${item["下價"]}</td>
        <td>${item["平均價"]}</td>
        <td>${item["交易量"]}</td>
      </tr>
      `
    })
    showResult.innerHTML = `查看${searchName || type}的比價結果，共${showData.length}筆資料`
  }
  showList.innerHTML = str
}

buttonGroup.addEventListener('click',(e) => {
  // 避免點到其他地方
  if(e.target.nodeName === 'BUTTON'){
    type = e.target.innerText
    buttonGroups.forEach((i) => {
      i.classList.remove('active')
    })
    e.target.classList.add('active')
    showData = data.filter((i) => {
      return i["種類代碼"] == e.target.getAttribute('data-type')
    })
    render(showData)
  }
})

searchBtn.addEventListener('click',search)
searchInput.addEventListener('keyup', (e) => {
  if(e.key == 'Enter'){
    search()
  }
})
function search(){
    if(searchInput.value.trim() ===  '') {
    alert('請輸入作物名稱')
    return
  }
  searchName = searchInput.value.trim()
  showData = data.filter((i) => {
    return i["作物名稱"].match(searchInput.value.trim())
  })
  searchInput.value = ''
  render(showData)
}


sortSelect.addEventListener('change',(e) => {
  sort = e.target.value
  upDown = 'up'
  sortData()
})

sortAdvanced.addEventListener('click',(e) => {
  if(e.target.nodeName === 'I'){
    upDown = e.target.getAttribute('data-sort')
    sort = e.target.getAttribute('data-price')
    sortBtn.forEach((i) => {
      i.classList.remove('text-danger')
    })
    e.target.classList.add('text-danger')
    sortData()
  }
})

function sortData() {
  if (showData.length === 0) {
    showData = data
  }
  showData.sort((a,b) => {
    if(upDown === 'up'){
      return b[sort] - a[sort]
    } else if(upDown === 'down'){
      return a[sort] - b[sort]
    }
  }) 
  render(showData)
}