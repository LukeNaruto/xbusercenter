<template>
  <div class="jigsaw-box dialog">
    <div ref="captcha" class="container">
			<button @click="$emit('hide_jigsaw')"  class="close" title="关闭"><i class="icon iconfont iconClose-box-px"></i></button>
		</div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
const l = 30, // 滑块边长
	r = 6, // 滑块半径
	w = 420, // canvas宽度
	h = 255, // canvas高度
	PI = Math.PI
const L = l + r * 2 // 滑块实际边长
function getRandomNumberByRange(start, end) {
	return Math.round(Math.random() * (end - start) + start)
}

function createCanvas(width, height) {
	const canvas = createElement('canvas')
	canvas.width = width
	canvas.height = height
	return canvas
}

function createImg(onload) {
	const img = createElement('img')
	img.crossOrigin = "Anonymous"
	img.onload = onload
	img.onerror = () => {
		img.src = getRandomImg()
	}
	img.src = getRandomImg()
	return img
}

function createElement(tagName) {
	return document.createElement(tagName)
}

function addClass(tag, className) {
	tag.classList.add(className)
}

function removeClass(tag, className) {
	tag.classList.remove(className)
}

function getRandomImg() {
	const img = require('@s/img/jigsaw/' + getRandomNumberByRange(1, 20) + '.png');
	return img;
}

function draw(ctx, operation, x, y) {
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.lineTo(x + l / 2, y)
	ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI)
	ctx.lineTo(x + l / 2, y)
	ctx.lineTo(x + l, y)
	ctx.lineTo(x + l, y + l / 2)
	ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI)
	ctx.lineTo(x + l, y + l / 2)
	ctx.lineTo(x + l, y + l)
	ctx.lineTo(x, y + l)
	ctx.lineTo(x, y)
	ctx.fillStyle = '#fff'
	ctx[operation]()
	ctx.beginPath()
	ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
	ctx.globalCompositeOperation = "xor"
	ctx.shadowBlur = 10; 
	ctx.shadowColor = "blank"; 
	ctx.fill()
}

function sum(x, y) {
	return x + y
}

function square(x) {
	return x * x
}
export default {
  data(){
    return {
      el: null,
			success: null,
			fail: null,
    }
  },
  props:['success_cb'],
  computed: {
    ...mapState('main', {
    }),
  },
  mounted(){
		setTimeout(()=>{
			this.init(this.$refs.captcha, this.success_cb)
		},1000)
  },  
  methods: {
    init(el, success, fail) {
			this.el = el
			this.success = success
			this.fail = fail
			this.initImg()
			this.initDOM()
			this.draw()
			this.bindEvents()
		},

		initDOM() {
			const canvas = createCanvas(w, h) // 画布
			const block = canvas.cloneNode(true) // 滑块
			const sliderContainer = createElement('div')
			const refreshIcon = createElement('div')
			const sliderMask = createElement('div')
			const slider = createElement('div')
			const sliderIcon = createElement('span')
			const text = createElement('span')

			canvas.className = 'blockBg'
			block.className = 'dragBlock'
			sliderContainer.className = 'sliderContainer'
			refreshIcon.className = 'refreshIcon'
			refreshIcon.title = '刷新'
			refreshIcon.innerHTML = '<i class="icon iconfont iconrefresh_"></i>'
			sliderMask.className = 'sliderMask'
			slider.className = 'slider'
			slider.innerHTML = '<i class="icon iconfont icondown-px"></i>'
			text.innerHTML = '向右滑动滑块填充拼图'
			text.className = 'sliderText'
			
			const el = this.el
			el.appendChild(canvas)
			el.appendChild(refreshIcon)
			el.appendChild(block)
			
			slider.appendChild(sliderIcon)
			sliderMask.appendChild(slider)
			sliderContainer.appendChild(sliderMask)
			sliderContainer.appendChild(text)
			el.appendChild(sliderContainer)

			Object.assign(this, {
				canvas,
				block,
				sliderContainer,
				refreshIcon,
				slider,
				sliderMask,
				sliderIcon,
				text,
				canvasCtx: canvas.getContext('2d'),
				blockCtx: block.getContext('2d')
			})
			window.aaa = this;
		},
		initImg() {
			const img = createImg(() => {
				this.canvasCtx.drawImage(img, 0, 0, w, h)
				this.blockCtx.drawImage(img, 0, 0, w, h)
				const y = this.y - r * 2 + 2
				const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
				this.block.width = L
				this.blockCtx.putImageData(ImageData, 0, y)
			})
			this.img = img
		},

		draw() {
			// 随机创建滑块的位置
			this.x = getRandomNumberByRange(L + 10, w - (L + 10))
			this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
			draw(this.canvasCtx, 'fill', this.x, this.y)
			draw(this.blockCtx, 'clip', this.x, this.y)
		},

		clean() {
			this.canvasCtx.clearRect(0, 0, w, h)
			this.blockCtx.clearRect(0, 0, w, h)
			this.block.width = w
		},

		bindEvents() {
			this.el.onselectstart = () => false
			this.refreshIcon.onclick = () => {
				this.reset()
			}
			let originX, originY, trail = [],
				isMouseDown = false
			this.slider.addEventListener('mousedown', function(e) {
				originX = e.x, originY = e.y
				isMouseDown = true
			})
			document.addEventListener('mousemove', (e) => {
				if(!isMouseDown) return false
				const moveX = e.x - originX
				const moveY = e.y - originY
				if(moveX < 0 || moveX + 38 >= w) return false
				this.slider.style.left = moveX + 'px'
				this.sliderMask.style.width = moveX + 'px'
				var blockLeft = (w - 40) / (w - 40) * moveX
				this.block.style.left = blockLeft + 'px'

				addClass(this.sliderContainer, 'active')
				this.sliderMask.style.width = moveX +  + 'px'
				trail.push(moveY)
			})
			document.addEventListener('mouseup', (e) => {
				if(!isMouseDown) return false
				isMouseDown = false
				if(e.x == originX) return false
				removeClass(this.sliderContainer, 'active')
				this.trail = trail
				const {
					spliced,
					TuringTest
				} = this.verify()
				if(spliced) {
					if(TuringTest) {
						addClass(this.sliderContainer, 'success')
						this.slider.innerHTML = '<i class="icon iconfont icongengduo-shuqian-wancheng-px"></i>'
						this.success && this.success()
					} else {
						addClass(this.sliderContainer, 'fail')
						this.text.innerHTML = '再试一次'
						this.reset()
					}
				} else {
					this.$Message.info({
						content: '<span class="icon iconfont iconfail-px1"></span>验证失败，请重新验证！',
						duration: 2.5,
					});
					addClass(this.sliderIcon, 'fail')
					addClass(this.sliderContainer, 'fail')
					this.fail && this.fail();
																							//验证失败后，1秒后重新加载图片
					setTimeout(() => {
						this.reset()
					}, 1000)
				}
			})
		},

		verify() {
			const arr = this.trail // 拖动时y轴的移动距离
			const average = arr.reduce(sum) / arr.length // 平均值
			const deviations = arr.map(x => x - average) // 偏差数组
			const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // 标准差
			const left = parseInt(this.block.style.left)
			return {
				spliced: Math.abs(left - this.x) < 3,
				TuringTest: average !== stddev, // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
			}
		},

		reset() {
			this.sliderContainer.className = 'sliderContainer'
			this.slider.innerHTML = '<i class="icon iconfont icondown-px"></i>'
			this.slider.style.left = 0
			this.block.style.left = 0
			this.sliderMask.style.width = 0
			this.clean()
			this.img.src = getRandomImg()
			this.draw()
		}
  }
}
</script>
<style lang="less" scoped>
@box-width: 420px;
@box-height: 320px;
.jigsaw-box{
	
	// background-image: url('../../static/img/jigsaw/dialogboxbg.png');
	// background-position: center;
	// background-repeat: no-repeat;
/deep/
.container {
	position: relative;
	width: @box-width;
	height: @box-height;
	margin: 24px auto 0;
	&:before{
		position: absolute;
		content: '加载中...';
		width: 480px;
		height: 400px;
		left: -30px;
		top: -50px;
		font-size: 16px;
		text-align: center;
		line-height: 400px;
		background: #fff;
		border-radius: 4px;
		z-index: -1;
	}
	.close {
		position: absolute;
		width: 20px;
		height: 20px;
		top: -40px;
		right: -22px;
	}
	.dragBlock {
		position: absolute;
		left: 0;
		top: 0;
	}
	.blockBg{
		background: #fff;
	}
	.sliderContainer {
		position: relative;
		text-align: center;
		width: 100%;
		height: 42px;
		line-height: 42px;
		margin-top: 15px;
		background: #f7f9fa;
		color: #45494c;
		border: 1px solid #e4e7eb;
		&.active{
			.slider {
				box-shadow: 0 0 3px rgba(0, 0, 0, 0.3), 0 0 0 1px #1991FA;
				color: #fff;
				background: #1991FA;
				.sliderIcon {
					background-position: 0 -13px;
				}
			}
			
			.sliderMask {
				box-shadow: 0 0 0 1px #1991FA;
			}
		}
		&.success{
			.slider {
				box-shadow: 0 0 3px rgba(0, 0, 0, 0.3), 0 0 0 1px #52CCBA;
				background-color: #52CCBA !important;
			}
			.sliderMask {
				box-shadow: 0 0 0 1px #52CCBA;
				background-color: #D2F4EF;
			}
			.sliderIcon {
				background-position: 0 0 !important;
			}
		}
		&.fail{
			.slider {
				box-shadow: 0 0 3px rgba(0, 0, 0, 0.3), 0 0 0 1px #f57a7a;
				background-color: #f57a7a !important;
			}
			.sliderMask {
				box-shadow: 0 0 0 1px #f57a7a;
				background-color: #fce1e1;
			}
			.sliderIcon {
				background-position: 0 -83px !important;
			}
		}
		&.active,&.fail,&.success{
			.sliderText{
				display: none;
			}
			.slider{ 
				color: #fff;
			}
		}
	}
	
	
	.sliderMask {
		position: absolute;
		left: 0;
		top: 0;
		height: 40px;
		border: 0 solid #1991FA;
		background: #D1E9FE;
	}
	
	.slider {
		position: absolute;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		background: #fff;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: background .2s linear,color .2s linear;
		&:hover {
			color: #fff;
			background: #1991FA;
			.sliderIcon {
				background-position: 0 -13px;
			}
		}
	}

	
	.refreshIcon {
		position: absolute;
		right: 0;
		top: 0;
		width: 34px;
		height: 34px;
		line-height: 34px;
		text-align: center;
		cursor: pointer;
		background-size: 34px 471px;
		transition: all .1s linear;
		color: #fff;
		&:hover{
			background:rgba(0, 0, 0, 0.1);
		}
	}
}

}
</style>
