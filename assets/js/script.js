window.onload = function() {
var chart = c3.generate({
	bindto: "#chart",
	data: {
		columns: [
			['Math', 30, 50, 10, 5, 0, 0],
			['Film', 20, 0, 10, 40, 15, 25],
			['History', 20, 20, 75, 5, 10, 20],
			['Philosophy', 10, 30, 0, 50, 50, 5],
			['Art', 10, 0, 0, 0, 5, 35],
			['Earth Science', 10, 0, 5, 0, 20, 15],
		]
	},
	 axis: {
        x: {
            type: 'category',
            categories: ['09/01', '09/04', '09/06', '09/09', '09/10', '09/11']
        }
    }

});

var chart2 = c3.generate({
	bindto:"#chart2",
	data: {
		columns: [
            ['Math', 40],
            ['Science', 10],
            ['Arts', 5],
            ['English', 30],
            ['History', 20],
        ],
		type : 'donut',

	},
    donut: {
        title: "National Data"
    }
})
}