'use strict';

const exchangeModule = require('./exchange.module');
const _              = require('lodash');
exchangeModule.controller('ExchangeController', ExchangeController);

/** @ngInject */
function ExchangeController(
	exchangeList,
	$state,
	exchangeService,
	$stateParams,
	$interval,
	$mdDialog,
	$localStorage
) {
	var vm             = this;
	vm.goSeek          = ()=> $state.go('root.withSidenav.seek');
	vm.myid            = parseInt($stateParams.uid, 10);
	vm.exchangeList    = exchangeList;
	vm.exchange        = {};
	vm.chatroom        = [];
	vm.chatContent     = '';
	vm.onClickGoods    = onClickGoods;
	vm.onClickExchange = onClickExchange;
	vm.onClickComplete = onClickComplete;
	vm.onClickDelete   = onClickDelete;
	vm.onSubmitChat    = onSubmitChat;
	vm.agreed          = false;


	////////////
	activate();

	function activate() {
		if($stateParams.uid !== $localStorage.user.uid.toString()) {
			$state.go('root.withSidenav.404');
		} else {
			if(vm.exchangeList.length) {
				vm.exchangeList.forEach(function(exchange) {
					exchangeService
						.getExchange(exchange.eid)
						.then(function(data) {
							exchange.details = data;
							exchange.lookupTable = {
								me   : data.goods[0].owner_uid === vm.myid ? 0 : 1,
								other: data.goods[1].owner_uid === vm.myid ? 0 : 1,
							};
						});
				});
				onClickExchange(0);
				agreed();
			}
		}
	}

	function onClickGoods(gid) {
		$state.go('root.withSidenav.goods', { gid : gid });
	}

	function updateChat() {
		if(!vm.exchange.eid) return;
		exchangeService
			.getChat(vm.exchange.eid, 100, 0)
			.then((data)=> { vm.chatroom = data; });
	}

	var timer;
	timer = $interval(updateChat, 5000);
	function onClickExchange(index) {
		vm.exchange = vm.exchangeList[index];
		updateChat();
		agreed();
	}

	function onClickComplete(ev) {
		exchangeService.showCompleteExchange(ev, vm.exchange, vm.myid, function(){ vm.agreed = true; });
		//agreed();
	}

	function onClickDelete(ev, eid) {
		var confirm = $mdDialog.confirm()
			.title('放棄這個交易')
			.content('您確定要放棄這個交易嗎？<br/>此動作無法回覆！')
			.ariaLabel('Delete Exchange')
			.ok('確定')
			.cancel('取消')
			.targetEvent(ev);
		if (confirm) {
			$mdDialog
				.show(confirm)
				.then(function() {
					exchangeService.deleteExchange(eid);
					$state.go('root.withSidenav.seek');
				});
		}
	}

	function onSubmitChat() {
		const chat = vm.chatContent.trim();
		if (chat) {
			const newChat = {
				eid        : vm.exchange.eid,
				sender_uid : vm.myid,
				content    : chat,
			};
			exchangeService
				.postChat(newChat)
				.then(function() {
					vm.chatContent = '';
					updateChat();
				});
		}
	}

	function agreed() {

	}
}
