'use strict';

const exchangeModule = require('./exchange.module');
const _              = require('lodash');
exchangeModule.controller('ExchangeController', ExchangeController);

/** @ngInject */
function ExchangeController(exchangeList, $state, exchangeService) {
	var vm             = this;
	vm.exchangeList    = exchangeList;
	vm.exchange        = {};
	vm.onClickExchange = onClickExchange;
	vm.onClickComplete = onClickComplete;
	vm.onClickDelete   = onClickDelete;


	activate();

	function activate() {
		if(vm.exchangeList.length) {
			onClickExchange(vm.exchangeList[0].eid);
		}
	}

	////////////

	function onClickExchange(eid) {
		exchangeService
			.getExchange(eid)
			.then(function(data) {
				console.log(data);
				vm.exchange = data;
			});
	}

	function onClickComplete(eid) {
		exchangeService
			.completeExchange(eid)
			.then(function(data) {
				console.log(data);
				//$state.reload();
			});
	}

	function onClickDelete(eid) {
		exchangeService
			.deleteExchange(eid)
			.then(function(data) {
				console.log(data);
				//$state.reload();
			});
	}
}
