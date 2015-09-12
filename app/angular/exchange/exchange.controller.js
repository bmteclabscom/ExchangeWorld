'use strict';

const exchangeModule = require('./exchange.module');
const _              = require('lodash');
exchangeModule.controller('ExchangeController', ExchangeController);

/** @ngInject */
function ExchangeController(exchangeList, $state, exchangeService, $stateParams, $interval) {
	var vm             = this;
	vm.myid            = $stateParams.uid;
	vm.exchangeList    = exchangeList;
	vm.exchange        = {};
	vm.chatroom        = [];
	vm.chatContent     = '';
	vm.onClickExchange = onClickExchange;
	vm.onClickComplete = onClickComplete;
	vm.onClickDelete   = onClickDelete;
	vm.onSubmitChat    = onSubmitChat;


	activate();

	function activate() {
		console.log(vm.myid);
		console.log(vm.exchangeList);
		if(vm.exchangeList.length) {
			vm.exchangeList.forEach(function(exchange) {
				exchangeService
					.getExchange(exchange.eid)
					.then(function(data) {
						//console.log(data);
						exchange.details = data;
						exchange.with = (data.goods[0].owner_uid === vm.myid)
							? data.goods[0].user.name
							: data.goods[1].user.name ;
					});
			});
			onClickExchange(vm.exchangeList[0].eid);
		}
	}

	function updateChat() {
		exchangeService
			.getChat(vm.exchange.eid, 100, 0)
			.then(function(data) {
				vm.chatroom = data;
			});
	}
	////////////

	function onClickExchange(eid) {
		exchangeService
			.getExchange(eid)
			.then(function(data) {
				//console.log(data);
				vm.exchange = data;
				updateChat();
				$interval(updateChat, 5000);
			});
	}

	function onClickComplete(ev) {
		exchangeService.showCompleteExchange(ev, vm.exchange, vm.myid);
		//exchangeService
			//.completeExchange(eid)
			//.then(function(data) {
				//console.log(data);
				////$state.reload();
			//});
	}

	function onClickDelete(eid) {
		exchangeService
			.deleteExchange(eid)
			.then(function(data) {
				console.log(data);
				//$state.reload();
			});
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

}
