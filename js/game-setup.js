(function ($) {
    $(".counter__increment, .counter__decrement").click(function(e)
		{
			var $this = $(this);
            console.log("TCL: $this", $this)
			var $counter__input = $(this).parent().find(".counter__input");
            console.log("TCL: $counter__input", $counter__input)
			var $currentVal = parseInt($(this).parent().find(".counter__input").val());
            console.log("TCL: $currentVal", $currentVal)

			//Increment
			if ($currentVal != NaN && $this.hasClass('counter__increment'))
			{
				$counter__input.val($currentVal + 1);
			}
			//Decrement
			else if ($currentVal != NaN && $this.hasClass('counter__decrement'))
			{
				if ($currentVal >= 1) {
					$counter__input.val($currentVal - 1);
				}
			}
		});

})(jQuery);