// 单击tab栏 切换
// 单击+     添加tab项和内容项
// 单击x     删除当前tab项和内容项
// 双击tab或内容，可修改文字内容


// 1.抽象对象 tab栏对象，该对象具有切换、添加、删除、修改功能
	var that;
	class Tab {
//1 constructor
		constructor(id) {   //id 传递 '#tab'
		 	that = this;
		// 1)获取元素
			this.main = document.querySelector(id);						  // 整体大盒子
			// this.lis = this.main.querySelectorAll('li');				  // li们
			// this.section = this.main.querySelectorAll('section');		  // section们
			this.add = this.main.querySelector('.tabadd');
			this.ul = this.main.querySelector('.firstnav ul:first-child');// css3选择器
			this.cont = this.main.querySelector('.tabscon');
			// this.remove = this.main.querySelectorAll('.icon-guanbi');
		// 2）                                  
			this.init();    // 一new就调用constructor就调用init()

		}

		// 初始化，用来给各个元素 绑定 各种事件
		init() {
			this.updateLiSection();         // 每次绑定事件前先更新 获取的元素(数量是否变化)

			this.add.onclick = this.addTab;	// 功能2，不带小括号
			for (var i = 0; i < this.lis.length; i++) {

				this.lis[i].index = i;
				this.lis[i].onclick = this.toggleTab; // 给li绑定的click事件
													  // 但这个事件要干啥——切换，要写到toggleTab方法里
													  // 不带小括号()
				this.remove[i].onclick = this.removeTab;

				this.span[i].ondblclick = this.editTab;    // 双击事件dbl
				this.section[i].ondblclick = this.editTab;
			}
		}

		//添加了新选项卡后，更新获取li元素和section元素
		updateLiSection() {  
			this.lis = this.main.querySelectorAll('li');			   	// li们
			this.section = this.main.querySelectorAll('section');	   	// section们
			this.remove = this.main.querySelectorAll('.icon-guanbi');  	//x们
			this.span = this.main.querySelectorAll('.firstnav li span:first-child');
		}

//3 其它功能方法s
		// 1)切换
		toggleTab() {
			// console.log(this.index);
			that.clearClass();									// 干掉所有
						// constructor里的this，调用清类名方法
						// 也就是实例对象mytab调用clearClass

			this.className = 'liactive';						// 复活自己
			that.section[this.index].className = 'conactive'
		}

		// 清除类
		clearClass() {  
			for (var i = 0; i < this.lis.length; i++) {
				this.lis[i].className = '';						// mytab调用clearClass，
				this.section[i].className = '';					// 这里面就可以分别写li和section了
			}
		}

		// 2)添加
		addTab() {
			// var random = Math.random();
			var ran = '请输入内容';

			that.clearClass();
			
			// 1 动态创建li 和 section，并添加元素
			var li = '<li class="liactive"><span>新标签</span><span class="iconfont icon-guanbi"></span></li>';
			var section ='<section class="conactive">' + ran + '</section>';
			that.ul.insertAdjacentHTML('beforeend', li);
			that.cont.insertAdjacentHTML('beforeend', section);
			// 2 其它兄弟移除当前类 放最前面
			
			// 3 给新创建的元素 绑定click事件 (重新获取 所有的li 和所有的section)
			that.init(); 
		}
		// 3)删除
		removeTab(e) {
			e.stopPropagation();  				//阻止冒泡触发切换事件

			// 1 获取索引号
			var index = this.parentNode.index;

			// 2 移除对应索引号的li和section
			that.lis[index].remove(); 			// 调用removeTab的是x按钮，所以用that不用this
			that.section[index].remove(); 		// 调用removeTab的是x按钮，所以用that不用this


			// 3 给新创建的元素 绑定click事件 (重新获取 所有的li 和所有的section)
			that.init();

			// 4 将所关页的上一个变为当前页(但如果关闭的不是当前页，就不执行第4步)

			if (document.querySelector('.liactive')) {   // 这关了当前页就没这个类名了,切换类在toggleTab()
				return;								     // 也是必须阻止冒泡，不让toggleTab生效，这段代码才管用
			} else {
				if (index >= 1) {
					index--;
					that.lis[index].click();            // 自动调用click
				}
				// index--;
				// that.lis[index] && that.lis[index].click();    
			}
		}
		// 4)修改
		editTab() {
			var str = this.innerHTML;



			// 1 双击时取消 默认选中文字效果
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
														// alert(1);  // 弹框会影响双击不选中效果
						 
			
			// 2 文本框内有默认文字，内容为原先的  		
			//   input.value 			
			this.innerHTML = '<input type="text">';
			var input = this.children[0];  // 这时候this是span
										   // 这时候才有input这个元素啊
			input.value = str;
			// this.innerHTML = '<input type="text" value=" ' + str + ' ">'

			
			// 3 文本框内容默认全选
			//   input.select()	 									   				
			input.select();    							// 让文本框内文字处于选定状态


			// 4 失去焦点或按下回车span内容变为新输入的    
			// 	 input.onblur   
			// 	 input.onkeyup						
			input.onblur = function() {
				this.parentNode.innerHTML = this.value; // span内容 = input的value内容
														// 这个函数里 this是input输入框
			}
			input.onkeyup = function(e) {
				if (e.keyCode === 13) {
					this.blur();                        // 手动调用onblur失去焦点事件
					// this.parentNode.innerHTML = this.value;
				}
			}




		}
	}

	var mytab = new Tab('#tab');   // 实例化大盒子
