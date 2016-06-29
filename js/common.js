var isDev = true;
if (typeof document.URL === 'string' && /dq10-battlerecorder\.xyz/.test(document.URL)) {
    isDev = false;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-75723194-1', 'auto');
    ga('send', 'pageview');

    window._pt_lt = new Date().getTime();
	  window._pt_sp_2 = [];
	  _pt_sp_2.push('setAccount,6bd8a30d');
	  var _protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
	  (function() {
		var atag = document.createElement('script'); atag.type = 'text/javascript'; atag.async = true;
		atag.src = _protocol + 'js.ptengine.jp/pta.js';
		var stag = document.createElement('script'); stag.type = 'text/javascript'; stag.async = true;
		stag.src = _protocol + 'js.ptengine.jp/pts.js';
		var s = document.getElementsByTagName('script')[0]; 
		s.parentNode.insertBefore(atag, s);s.parentNode.insertBefore(stag, s);
    })();
}

var aggregatedResult;
var chart;

window.onload = function () {

    var main = new Vue({
        el: '#app',
        data: {
	    newTodo: '',
	    results: [],
            jobs: [
                '戦士','武闘家','僧侶','魔法使い','盗賊','旅芸人','魔法戦士','レンジャー','パラディン','賢者','スーパースター','まもの使い','道具使い','踊り子'
            ]
            ,job: ''
            ,ranks: [
                'F-C','B-A','S-S+','SS'
            ]
            ,rank: ''
            ,target_date: ''
            ,msgStat:1
            ,jobSelectedStat: [0,1,0,0,0,0]
            ,rankSelectedStat: [1,0,0,0]
            ,battleDate:''
            ,msgContent:''
            ,temp:''
            ,jobForGraph:''
            ,rankForGraph:''  
            ,dateFrom:''       
            ,dateTo:''   
            ,graphDescription:''    
            ,averageRate:0
            ,battleCount:0
            ,dateList:[]
            ,selectedDate:''
            ,memo:''
            ,isDuringGp:false
            ,isDuringGpForGraph:false
            ,userChat:''
        },
        methods: {
	        addWon: function () {
	            this.saveResult(100)
	            
	        },
	        addLost: function () {
	            this.saveResult(0)
	        },
	        saveResult: function(wonOrLost) {

	            if (this.battleDate.length==0) {
                       this.msgContent = '日付は必須入力です'
                       this.msgStat = 0
	               setTimeout(this.hideMsg,1500)
                       return
                    } 

	            //this.results.push({ result: wonOrLost ,job:this.job, rank:this.rank, date:this.battleDate, custom1:this.checkCustom1, custom2:this.checkCustom2, custom3:this.checkCustom3})
                    this.results.push({ result: wonOrLost ,job:this.job, rank:this.rank, date:this.battleDate, gp:this.isDuringGp})
	            this.msgContent = '登録しました'
	            this.msgStat = 0
	            setTimeout(this.hideMsg,1500)
	            if (('localStorage' in window) && (window.localStorage !== null)) {

	                // データの保存
	                localStorage.setItem('results', JSON.stringify(this.results))

	                // 画面表示用
	                localStorage.setItem('job', this.job)
	                localStorage.setItem('rank', this.rank)
	                localStorage.setItem('battle_date', this.battleDate)
                        localStorage.setItem('isDuringGp', this.isDuringGp)

	            } else {
	                this.msgContent = 'お使いのブラウザではデータセーブができません';
	            }
                    if (!isDev) {window.ga('send', 'pageview', '/save');}

	        },
	        remove: function (index) {
	            this.results.splice(index, 1)
	            if (('localStorage' in window) && (window.localStorage !== null)) {

	                // データの保存
	                localStorage.setItem('results', JSON.stringify(this.results));


	            } else {
	                alert("お使いのブラウザではデータセーブができません。");
	            }
	        },
	        setJob: function (index) {
	            this.job = this.jobs[index]
	            this.jobSelectedStat=[0,0,0,0,0,0]
	            this.jobSelectedStat[index]=true

	        },
	         setRank: function (index) {
	            this.rank = this.ranks[index]
	            this.rankSelectedStat=[0,0,0,0]
	            this.rankSelectedStat[index]=true

	        },
	        setBattleDate: function (date) {
	            this.BattleDate = date
	            

	        },
	        hideMsg: function() {
	            this.msgStat = 1
	  
	        },
                clearJobForGraph: function() {
                    this.jobForGraph = ''
                },
                clearRankForGraph: function() {
                    this.rankForGraph = ''
                },
                clearSelectedDate: function() {
                    this.selectedDate = ''
                },
                clearMemo: function() {
                    this.memo = ''
                    localStorage.removeItem('memo')
                },
                deleteAllResult: function() {
                    myRet = confirm('全データを削除しますか？');
                    if(myRet) {
                        localStorage.removeItem('results')
                    }
                },
                clearDateForGraph: function() {
                    this.dateTo = ''
                    this.dateFrom = ''
                    $('.input-group.date.from').datepicker('setDate', '')
                    $('.input-group.date.to').datepicker('setDate', '')
                    localStorage.removeItem('dateFrom')
	            localStorage.removeItem('dateTo')
                },
	        aggregateResult: function() {
	            aggregatedResultByDate = Enumerable.From(this.results)
	                               .GroupBy('$.date', '$.result', '{ rate: $$.Average(), date: $}')
	                               .ToJSON()

                    this.dateList = Enumerable.From(this.results)
                                     .GroupBy('$.date','','{date: $}')
                                     .ToArray()

                },
                reAggregateResult: function() {
                    if (('localStorage' in window) && (window.localStorage !== null)) {
                        localStorage.setItem('jobForGraph', this.jobForGraph)
	                localStorage.setItem('rankForGraph', this.rankForGraph)
                        localStorage.setItem('dateFrom', this.dateFrom)
	                localStorage.setItem('dateTo', this.dateTo)
                        localStorage.setItem('isDuringGpForGraph', this.isDuringGpForGraph.toString())
                        localStorage.setItem('memo', this.memo)

                    }

                    this.battleCount =  Enumerable.From(this.results)
	                               .Where(function (x) { return (main.dateFrom=='') ? x: (x.date >= main.dateFrom) })
                                       .Where(function (x) { return (main.dateTo=='') ? x: (x.date <= main.dateTo) })
                                       .Where(function (x) { return (main.jobForGraph=='') ? x: x.job == main.jobForGraph })
                                       .Where(function (x) { return (main.rankForGraph=='') ? x: x.rank == main.rankForGraph })
                                       .Where(function (x) { return (main.isDuringGpForGraph==true) ? x.gp === true :x })
                                       .Count()
                    
                    if (this.battleCount==0) {
                        //this.msgStat = 0
	                //setTimeout(this.hideMsg,1500)
                        //this.msgContent = '対象データがありません'
                        this.averageRate = 0
                        chart.options.stacked = true;
                        chart.setData([{rate:0,date:''}]);
                        chart.redraw();
                        this.getGraphDescription();
                        
                    } else {

	                aggregatedResultByDate = Enumerable.From(this.results)
	                               .Where(function (x) { return (main.dateFrom=='') ? x: (x.date >= main.dateFrom) })
                                       .Where(function (x) { return (main.dateTo=='') ? x: (x.date <= main.dateTo) })
                                       .Where(function (x) { return (main.jobForGraph=='') ? x: x.job == main.jobForGraph })
                                       .Where(function (x) { return (main.rankForGraph=='') ? x: x.rank == main.rankForGraph })
                                       .Where(function (x) { return (main.isDuringGpForGraph==true) ? x.gp === true :x })
	                               .GroupBy('$.date', '$.result', '{ rate: $$.Average(), date: $, count: $$.Count()}')
	                               .ToJSON()


                        chart.options.stacked = true;
                        chart.setData(JSON.parse(aggregatedResultByDate));
                        chart.redraw();

                        this.averageRate =  Enumerable.From(this.results)
	                               .Where(function (x) { return (main.dateFrom=='') ? x: (x.date >= main.dateFrom) })
                                       .Where(function (x) { return (main.dateTo=='') ? x: (x.date <= main.dateTo) })
                                       .Where(function (x) { return (main.jobForGraph=='') ? x: x.job == main.jobForGraph })
                                       .Where(function (x) { return (main.rankForGraph=='') ? x: x.rank == main.rankForGraph })
                                       .Where(function (x) { return (main.isDuringGpForGraph==true) ? x.gp === true :x  })
                                       .Average('$.result')
                        
                        this.averageRate = Math.round(parseFloat(this.averageRate)*100)/100

                        this.getGraphDescription()
                    }

                    setTimeout(this.reAggregateResult,3000);
       

                },
                getGraphDescription: function() {
                    var msgFrom = (this.dateFrom=='') ? '無指定':this.dateFrom
                    var msgTo = (this.dateTo=='') ? '無指定':this.dateTo
                    this.graphDescription = msgFrom + '～' + msgTo + ' JOB:' + this.jobForGraph + ' RANK:' + this.rankForGraph
                },
                scrollToLatest: function() {
                    $("html,body").animate({scrollTop:$('#end-result-list').offset().top});
                },
                scrollToTop: function() {
                    $("html,body").animate({scrollTop:0});
                },
                sendToBot: function() {
                    
                    $.ajax({
			  url: 'https://chatbot-api.userlocal.jp/api/chat?message=' + this.userChat + '&key=362e805802e4ba2b44d3',
			  type: 'GET',
			  success: function(result , status , xhr)  {
                                    console.log(result.responseText);
                             	    var xml = $.parseXML(result.responseText);
			            var $xml = $(xml);
			            var $body = $xml.find("body");
			            var text=$.parseJSON($body.text());
			            $('#botchat').text(text['result']);
				    
                                    
			    
			  }
			});
                    $('#userchat').text(this.userChat);
                    this.userChat='';
                }
                
       }

});
      $('.input-group.date').datepicker(
        {
	    format: 'yyyy-mm-dd',
	    language: 'ja',
	    autoclose: true,
	    clearBtn: true,
            todayHighlight: true
            
        }

      );

     

      if (localStorage.getItem('results')!=null) {
          main.results = JSON.parse(localStorage.getItem('results'));
      }
      if (localStorage.getItem('battle_date')!=null) {
          
          $('.input-group.date.tab1').datepicker('option', {'dateFormat': 'yyyy-mm-dd'})
          $('.input-group.date.tab1').datepicker('setDate', localStorage.getItem('battle_date'))
          main.battleDate = localStorage.getItem('battle_date')
      }
      if (localStorage.getItem('job')!=null) {
          var i = main.jobs.indexOf(localStorage.getItem('job'))
          main.setJob(i)
      }
      if (localStorage.getItem('rank')!=null) {
          var i = main.ranks.indexOf(localStorage.getItem('rank'))
          main.setRank(i)
      }
      if (localStorage.getItem('jobForGraph')!=null) {
          main.jobForGraph = localStorage.getItem('jobForGraph')
      }
      if (localStorage.getItem('rankForGraph')!=null) {
          main.rankForGraph = localStorage.getItem('rankForGraph')
      }
      if (localStorage.getItem('dateFrom')!=null) {
          
          $('.input-group.date.from').datepicker('option', {'dateFormat': 'yyyy-mm-dd'})
          $('.input-group.date.from').datepicker('setDate', localStorage.getItem('dateFrom'))
          main.dateFrom = localStorage.getItem('dateFrom')
      }
      if (localStorage.getItem('dateTo')!=null) {
          
          $('.input-group.date.to').datepicker('option', {'dateFormat': 'yyyy-mm-dd'})
          $('.input-group.date.to').datepicker('setDate', localStorage.getItem('dateTo'))
          main.dateTo = localStorage.getItem('dateTo')
      }
      if (localStorage.getItem('memo')!=null) {
          main.memo = localStorage.getItem('memo')
      }
      if (localStorage.getItem('isDuringGp')=='true') {
          main.isDuringGp = true
      }
      if (localStorage.getItem('isDuringGpForGraph')=='true') {
          main.isDuringGpForGraph = true
      }

      main.aggregateResult();

      chart = new Morris.Line({

          element: 'graph-bydate',
          data: JSON.parse(aggregatedResultByDate),
          xkey: 'date',
          ykeys: ['rate','count'],
          labels: ['勝率','試合数'],
          xLabels: ["day"],
          ymax:100,
          ymin:0,
          lineColors: ['#0b62a4','#ee7b1a']
          
      });

      main.reAggregateResult();

}