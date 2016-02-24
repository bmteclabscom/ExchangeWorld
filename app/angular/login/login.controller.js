'use strict';

const loginModule = require('./login.module');

loginModule.controller('LoginController', LoginController);

/** @ngInject */
function LoginController(
	auth,
	exception,
	$scope,
	$state,
	$mdDialog,
	$rootScope,
	$localStorage
) {
	const vm = this;
	vm.goSignup = goSignup;
	vm.login = login;
	vm.form = {
		id: '',
		pwd: ''
	};

	async function login(fb) {

		try {
			let user = await auth.login(fb, vm.form.id, vm.form.pwd);
			$rootScope.isLoggedIn = Boolean(user);
			$localStorage.user = user;

			$state.go('root.withSidenav.seek');

			closePopup();
		} catch (err) {
			if (!err.data.token) exception.catcher('帳密組合錯誤或無此帳號')(err);
			else exception.catcher('唉呀出錯了！')(err);
		}
	}

	function goSignup() {
		if ($scope.instance) {
			$mdDialog.hide();
			$rootScope.openSignupModal();
		} else {
			$state.go('root.oneCol.signup');
		}
	}
	function goLogin() {
		if ($scope.instance) {
			$mdDialog.hide();
			$rootScope.openLoginModal();
		} else {
			$state.go('root.oneCol.login');
		}
	}

	function closePopup() {
		if ($scope.instance) $mdDialog.hide();
	}
}
