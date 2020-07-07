var stompClient = null;

function setConnected(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  if (connected) {
    $("#conversation").show();
  }
  else {
    $("#conversation").hide();
  }
  $("#greetings").html("");
}

function connect() {
  var socket = new SockJS('/gs-guide-websocket');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', function (greeting) {
      showGreeting(JSON.parse(greeting.body).content);
      var result = JSON.parse(greeting.body).content;
      console.log(JSON.parse(greeting.body).content);

      var myChart = echarts.getInstanceByDom(document.getElementById('mainChart'));
      myChart.setOption({
          title : {
            text: 'click:'+ result,
            subtext: '初始信息',
            x:'center'
          }
        });
    });
  });
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  setConnected(false);
  console.log("Disconnected");
}

function sendName() {
  stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
  $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function chartInit(){

  var myChart = echarts.init(document.getElementById('mainChart'));

// 指定图表的配置项和数据
  var option = {
    title : {
      text: '没有任何点击',
      subtext: '初始信息',
      x:'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
      {
        name:'访问来源',
        type:'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:[
          {value:parseInt(Math.random()*1000), name:'直接访问'},
          {value:parseInt(Math.random()*1000), name:'邮件营销'},
          {value:parseInt(Math.random()*1000), name:'联盟广告'},
          {value:parseInt(Math.random()*1000), name:'视频广告'},
          {value:parseInt(Math.random()*1000), name:'搜索引擎'}
        ]
      }
    ]
  };
  myChart.setOption(option);
}

$(function () {
  $("form").on('submit', function (e) {
    e.preventDefault();
  });
  $("#connect").click(function () {
    connect();
  });
  $("#disconnect").click(function () {
    disconnect();
  });
  $("#send").click(function () {
    sendName();
  });
  chartInit();
});

