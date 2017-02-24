(function() {
	'use strict';

	angular
		.module('App')
		.controller('SignatureController', SignatureController);

	SignatureController.$inject = ['$scope', 'SignaturePlay', 'Modals'];
	function SignatureController($scope, SignaturePlay, Modals) {

		//Based on http://perfectionkills.com/exploring-canvas-drawing-techniques/
		$scope.signature = {
            width: "100%",
			renderer: Phaser.CANVAS,
			state: angular.copy(SignaturePlay),
			initialize: false
		};

		$scope.signatureTool = {
			lineWidth: 5,
			options: [
				{
					image: "res/signature/assets/1.png",
					selected: true
				}, {
					image: "res/signature/assets/2.png"
				}, {
					image: "res/signature/assets/3.png"
				}, {
					image: "res/signature/assets/4.png"
				}, {
					image: "res/signature/assets/5.png"
				}, {
					image: "res/signature/assets/6.png"
				}, {
					image: "res/signature/assets/7.png"
				}, {
					image: "res/signature/assets/8.png"
				}, {
					image: "res/signature/assets/9.png"
				}, {
					image: "res/signature/assets/10.png"
				}, {
					image: "res/signature/assets/11.png"
				}, {
					image: "res/signature/assets/12.png"
				}, {
					image: "res/signature/assets/13.png"
				}, {
					image: "res/signature/assets/14.png"
				}, {
					image: "res/signature/assets/15.png"
				}]
		};

		$scope.selectOption = function(position) {

			$scope.signatureTool.options.map(function(option) { option.selected = false; });
			$scope.signatureTool.options[position].selected = true;
			$scope.signature.instance.state.getCurrentState().changeOption(position);
		};

		$scope.changeLineWidth = function() {
			$scope.signature.instance.state.getCurrentState().changeLineWidth($scope.signatureTool.lineWidth);
		};

		$scope.clearSignature = function() {
			$scope.signature.instance.state.getCurrentState().clearCanvas();
		};

		$scope.previewSignature = function() {

			$scope.previewImage = $scope.signature.instance.state.getCurrentState().getImage();
			Modals.openModal($scope, 'templates/modals/previewImage.html', 'bounceInRight animated');
		};
		
		$scope.closeModal = function(){
			Modals.closeModal();
		};
		
		$scope.$on('$ionicView.afterEnter', function () {
			$scope.signature.height = document.getElementById("signature").clientHeight;
			$scope.signature.initialize = true;
            
            $scope.signatureTool.lineWidth = 5;
            $scope.signatureTool.options.map(function (option) { option.selected = false; });
            $scope.signatureTool.options[0].selected = true;
		});
	}
})();