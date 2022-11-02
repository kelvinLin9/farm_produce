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
const buttonGroup = document.querySelector('.button-group')
const buttonGroups = document.querySelectorAll('.button-group button')
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

buttonGroup.addEventListener('click',(e) => {
  sortBtn.forEach((i) => {
    i.classList.remove('text-danger')
  })
  sortSelects[0].selected = true
  // 避免點到其他地方
  if(e.target.nodeName === 'BUTTON'){
    searchName = ''
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
  sortBtn.forEach((i) => {
    i.classList.remove('text-danger')
  })
  sortSelects[0].selected = true
  buttonGroups.forEach((i) => {
    i.classList.remove('active')
  })
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
  console.log(e.target.value)
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

function sortData(sortOrder,sortItem) {
  showData.sort((a,b) => {
    if(sortOrder === 'asc'){
      return b[sortItem] - a[sortItem]
    } else if(sortOrder === 'desc'){
      return a[sortItem] - b[sortItem]
    }
  }) 
  render(showData)
}