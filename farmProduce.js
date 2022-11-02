let data = []
let showData = []
let searchName = ''
let type = ''
let sortItem = ''
let sortOrder = ''

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
const TypeBtn = document.querySelector('.button-group')
const TypeBtns = document.querySelectorAll('.button-group button')
const searchInput = document.querySelector('.rounded-end')
const searchBtn = document.querySelector('.search')
const sortSelect = document.querySelector('.sort-select')
const sortSelects = document.querySelectorAll('.sort-select option')
const sortAdvanced = document.querySelector('.js-sort-advanced')
const sortBtn = document.querySelectorAll('.js-sort-advanced i')

function render(showData) {
  let str = ''
  if (showData.length === 0 && searchName === ''){
    str = `
    <td colspan="7" class="text-center p-3">
      請輸入並搜尋想比價的作物名稱^_^
    </td>
    `
  }else if(showData.length === 0 && searchName !== '') {
    str = `
    <td colspan="7" class="text-center p-3">
      查詢不到當日交易資訊Q_Q
    </td>
    `
    showResult.innerHTML = `查看「${searchName || type}」的比價結果，共${showData.length}筆資料`
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
    showResult.innerHTML = `查看「${searchName || type}」的比價結果，共${showData.length}筆資料`
  }
  showList.innerHTML = str
}
// 點擊分類按鈕&搜尋時用
function removeSortBtn () {
  sortBtn.forEach((i) => {
    i.classList.remove('text-danger')
  })
  sortSelects[0].selected = true
}

function removeTypeBtn () {
  TypeBtns.forEach((i) => {
    i.classList.remove('active')
  })
}

function addStyle(et) {
    searchName = ''
    type = et.innerText
    removeTypeBtn()
    et.classList.add('active')
}

function filterData(et) {
  showData = data.filter((i) => {
    return i["種類代碼"] == et.getAttribute('data-type')
  })
  render(showData)
}

TypeBtn.addEventListener('click',(e) => {
  removeSortBtn ()
  if(e.target.nodeName === 'BUTTON'){
    addStyle(e.target)
    filterData(e.target)
  }
})

searchBtn.addEventListener('click',search)
searchInput.addEventListener('keyup', (e) => {
  if(e.key == 'Enter'){
    search()
  }
})

function search() {
  removeSortBtn()
  removeTypeBtn()
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
  sortItem = e.target.value
  sortOrder = 'asc'
  sortData(sortOrder,sortItem)
})
sortAdvanced.addEventListener('click',(e) => {
  if(e.target.nodeName === 'I'){
    sortOrder = e.target.getAttribute('data-sort')
    sortItem = e.target.getAttribute('data-price')
    sortSelects[e.target.getAttribute('data-num')].selected = true
    sortBtn.forEach((i) => {
      i.classList.remove('text-danger')
    })
    e.target.classList.add('text-danger')
    sortData(sortOrder,sortItem)
  }
})

function sortData(so,si) {
  showData.sort((a,b) => {
    if(so === 'asc'){
      return b[si] - a[si]
    } else if(so === 'desc'){
      return a[si] - b[si]
    }
  }) 
  render(showData)
}