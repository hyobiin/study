window.addEventListener('DOMContentLoaded', function(){
  // alert('Modal을 호출하기 위한 생성자가 선언되지 않았습니다.');
  if(Modal.initFlag !== true){
    this.alert('Modal을 호출하기 위한 생성자가 선언되지 않았습니다.\n사용방법은 콘솔창을 참고해주세요.')
    console.log('==================================== modal dialog 호출 방법 ====================================');
    console.log('1. DOMContentLoaded 호출 시점에서 [ modal = new Modal(); ] 와 같은 형태로 모달을 생성해야 합니다.');
    console.log('2. ※ new Modal() 로 변수를 생성할 때 함수 내부에서 변수 스코프(var, let, const)를 선언하면 전역으로 사용할 수 없습니다.');
    console.log('3. 여러개의 모달을 생성할 경우 변수명(ex. var modal1, modal2)만 다르게 해서 생성할 수 있습니다.');
    console.log('4. setWidth, setHeight, setTitle, setContent, setFooter, setModalDisplayBtnIds를 통해 모달의 내용을 변경 할 수 있습니다.');
    console.log('5. show, hide를 통해 모달을 표시 및 비표시 할 수 있습니다. (ex. modal.show())');
    console.log('================================================================================================');
  }
});

// 모듈화하기
// class Modal 안에 있는 html 변수를 전역변수로 만들기 위해 모듈화
const Modal = (function(){
  let html = window.atob('PGRpdiBjbGFzcz0ibW9kYWwiPjxkaXYgY2xhc3M9Im1vZGFsX2lubmVyIj48ZGl2IGNsYXNzPSJtb2RhbF9jb250ZW50Ij48ZGl2IGNsYXNzPSJtb2RhbF9oZWFkZXIiPjxzcGFuIGNsYXNzPSJjbG9zZSI+JnRpbWVzOzwvc3Bhbj48ZGl2IGNsYXNzPSJtb2RhbF90aXRsZSI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0ibW9kYWxfYm9keSI+PC9kaXY+PGRpdiBjbGFzcz0ibW9kYWxfZm9vdGVyIj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4=');

  class Modal{
    constructor(){
      // modal을 띄워주기 위해
      // initFlag 등 모든 처음 값은 undefined
      Modal.initFlag = !Modal.initFlag;

      // 인코딩 디코딩
      // window.btoa('<div class="modal"><div class="modal_inner"><div class="modal_content"><div class="modal_header"><span class="close">&times;</span><div class="modal_title"></div></div><div class="modal_body"></div><div class="modal_footer"></div></div></div></div>');
      // window.atob('PGRpdiBjbGFzcz0ibW9kYWwiPjxkaXYgY2xhc3M9Im1vZGFsX2lubmVyIj48ZGl2IGNsYXNzPSJtb2RhbF9jb250ZW50Ij48ZGl2IGNsYXNzPSJtb2RhbF9oZWFkZXIiPjxzcGFuIGNsYXNzPSJjbG9zZSI+JnRpbWVzOzwvc3Bhbj48ZGl2IGNsYXNzPSJtb2RhbF90aXRsZSI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0ibW9kYWxfYm9keSI+PC9kaXY+PGRpdiBjbGFzcz0ibW9kYWxfZm9vdGVyIj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4=');
      this.node = document.createElement('div');
      this.node.innerHTML = html;
      this.node = this.node.children[0];
  
      document.body.append(this.node);

      let that = this;

      this.node.querySelector('.modal_header').querySelector('.close').addEventListener('click', function(){
        // 여기에서 this는 해당 function을 바라보기 때문에 that을 사용
        that.hide();
      });
    }
  
    setWidth(width){
      this.node.querySelector('.modal_content').style.width = width;

      return this; // **체이닝 => html에서 checkIdModal.setWidth('400px'); => checkIdModal 반복을 줄이기 위해
    }

    setHeight(height){
      this.node.querySelector('.modal_content').style.height = height;

      return this;
    }

    setHeader(header){
      if(header == null){
        this.node.querySelector('.modal_header').style.display = "none";
      }else{
        this.node.querySelector('.modal_header').innerHTML = header;
      }

      return this;
    }

    setTitle(title){
      this.node.querySelector('.modal_title').innerHTML = "<h2>" + title + "</h2>";

      return this;
    }

    setContent(content){
      this.node.querySelector('.modal_body').innerHTML = content;

      return this;
    }

    // 버튼 여부
    // setFooter(footer){
    //   this.node.querySelector('.modal_footer').innerHTML = footer;

    //    return this;
    // }

    setPositiveButton(text, callback){
      let negNode = null;

      this.posFlag = true;

      if(this.negFlag){
        negNode = this.node.querySelector('.modal_footer').querySelector('.modal_confirm.neg');
      }

      // 같은 버튼 중복되지 않게
      if(this.node.querySelector('.modal_footer').querySelector('.modal_confirm') != null){
        this.node.querySelector('.modal_footer').innerHTML = '';
      }

      let tmpDiv = document.createElement('div');

      tmpDiv.innerHTML = '<span class="btn btn_style1 modal_confirm pos">' + text + '</span>';

      if(callback != null && typeof callback == 'function'){
        tmpDiv.childNodes[0].addEventListener('click', callback);
      }else{
        console.log('regist fail cacllback listener');
      }

      if(this.negFlag && negNode != null){
        this.node.querySelector('.modal_footer').append(negNode);
      }

      this.node.querySelector('.modal_footer').append(tmpDiv.childNodes[0]);

      return this;
    }

    setNegativeButton(text, callback){
      let posNode = null;

      this.negFlag = true;

      if(this.posFlag){
        posNode = this.node.querySelector('.modal_footer').querySelector('.modal_confirm.pos');
      }

      // 같은 버튼 중복되지 않게
      if(this.node.querySelector('.modal_footer').querySelector('.modal_confirm') != null){
        this.node.querySelector('.modal_footer').innerHTML = '';
      }

      let tmpDiv = document.createElement('div');

      tmpDiv.innerHTML = '<span class="btn btn_style1 modal_confirm neg">' + text + '</span>';

      if(callback != null && typeof callback == 'function'){
        tmpDiv.childNodes[0].addEventListener('click', callback);
      }else{
        console.log('regist fail cacllback listener');
      }

      this.node.querySelector('.modal_footer').append(tmpDiv.childNodes[0]);
      
      if(this.negFlag && posNode != null){
        this.node.querySelector('.modal_footer').append(posNode);
      }
    }

    // id로 같은 모달 띄우기
    setModalDisplayBtnIds(ids){
      if(ids == null || typeof ids != 'object' || ids.length == null){
        throw new Error('버튼을 표시하기 위한 아이디는 스트링 배열 형태로 [\"id1\", \"id2\"]와 같은 형태로 넘겨주어야 합니다.')
      }

      let that = this; // Modal

      for(let id of ids){
        if(typeof id == 'string'){
          document.getElementById(id).addEventListener('click', function(){that.show();});
        }
      }

      return this;
    }

    show(){
      this.node.style.display = 'table';
    }

    hide(){
      this.node.style.display = 'none';
    }
  }

  return Modal;
})();

