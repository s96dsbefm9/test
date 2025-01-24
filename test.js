var questions = [];
var resultMap = {};
var questionId;

$(function () {
  $('#selectfile').on('change', function(e) {
    var result = e.target.files[0];
    if(!result){
      return
    }
    //FileReaderのインスタンスを作成する
    var reader = new FileReader();
    //読み込んだファイルの中身を取得する
    reader.readAsText(result);
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', function() {
      //ファイルの中身をJSON形式に変換する
      jsonobj = JSON.parse(reader.result);
      if(jsonobj.type=='test'){
        questions = jsonobj.questions;
        $('#testtitle').text(jsonobj.title);
        questionId=jsonobj.id;
        for(var question of questions){
          question.rate = 0;
        }
        createtable();
      }
    })
  });
  
  $('#loadresult').on('change', function(e) {
    var result = e.target.files[0];
    //console.log('loadresult', result);
    if(!result){
      return
    }
    //FileReaderのインスタンスを作成する
    var reader = new FileReader();
    //読み込んだファイルの中身を取得する
    reader.readAsText(result);
    //ファイルの中身を取得後に処理を行う
    reader.addEventListener( 'load', function() {
      //ファイルの中身をJSON形式に変換する
      jsonobj = JSON.parse(reader.result);
      //console.log('jsonobj', jsonobj);
      if(jsonobj.type=='result' && questionId==jsonobj.id){
        resultMap = jsonobj.resultMap;
        //console.log('resultMap', resultMap);
        for(var question of questions){
          var result = resultMap[question.no];
          if(result){
            question.rate = (result.ok / (result.ok + result.ng)).toFixed(3);
          }
        }
      }
    })
  });
});
function sortrandom(arr0){
  var copy = [];
  var arr=arr0.concat();
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    copy.push(arr.splice(i, 1)[0]);
  }
  return copy;
}
function createtable(){
  for (var question of questions){
    //console.log(`question id=${question.no}, rate=${question.rate}`);
    var h= '<hr><table class="top-table"><tbody>';
    h+=`<tr><td style="width: 50%; id=${question.no}">質問 #</td><td>スコア ${question.rate}</td></tr>`;
    h+=`<tr>${question.question}</tr>`;
    h+='</tbody></table>';
    h+=`<table class="no-top-table"><tbody id="choices_${question.no}">`;

    var choices=sortrandom(question.choices);
    //console.log('choices', choices)
    for(var i=0;i<choices.length;i++){
      var choice =choices[i];
      h+=`<tr id="question_${question.no}_choice_${choice.id}"><td class="question-choice">`;
      h+=`<input type="checkbox" id="question_${question.no}_choice_${choice.id}_check">`;
      h+=`<label for="question_${question.no}_choice_${choice.id}_check" class="question-choice-label">${i+1}</label>`;
      h+=`<label for="question_${question.no}_choice_${choice.id}_check" id="question_${question.no}_choice_${choice.id}_label" class="hidden question-choice-label">(${choice.id})</label></td>`;
      h+=`<td class="main-text"><label for="question_${question.no}_choice_${choice.id}_check">${choice.text}</label></td></tr>`;
    }
    h+=`<tr><td colspan="2"><input type="button" value="Check Answer" onclick="onclickAnswer(${question.no})" id="${question.no}_answerbtn"/></td></tr>`;
    h+='</tbody></table>';
    if(question.explanation){
      h+=`<div id="answer_${question.no}"><table class="no-top-table"><tbody>`;
      h+='<tr>Explanation</tr>';
      h+=`<tr>${question.explanation}</tr>`;
      h+='</tbody></table></div>';
    }
    $('#datatable').append(h);
    $(`#answer_${question.no}`).hide();
  }
}
function onclickAnswer(id){
  console.log('onclickAnswer', id);
  var question;
  for(var q of questions){
    if(q.no==id){
      question=q;
      break;
    }
  }
  console.log('question', question);
  
  var miss=false;
  //console.log('answers', question.answers);
  for(var choice of question.choices){
    var $checkbox = $(`#question_${id}_choice_${choice.id}_check`);
    var checked = $checkbox.prop('checked');
    var correct = question.answers.includes(choice.id);
    //console.log('choice['+choice.id+'] is '+correct);
    //console.log('checked', checked);
    $(`#question_${question.no}_choice_${choice.id}_label`).removeClass('hidden');
    if(correct){
      $(`#question_${question.no}_choice_${choice.id}_label`).addClass('question-choice-label-correct');
    }

    if(checked == correct){
      $(`#question_${id}_choice_${choice.id}`).css('background-color', '#a8ffff');
    }else{
      $(`#question_${id}_choice_${choice.id}`).css('background-color', '#ffa8a8');
      miss=true
    }
  }
  $(`#question_${id}_answerbtn`).disabled=true;
  
  var result = resultMap[id];
  //console.log('result('+id+')' , result);
  var ok=0;
  var ng=0;
  if(result){
    ok=result.ok;
    ng=result.ng;
  }
  if(miss){
    ng++;
  }else{
    ok++;
  }
  $(`#answer_${id}`).show();
  resultMap[id]={ok:ok, ng:ng};
}
function saveResult(){
  for (var question of questions){
    var result = resultMap[question.no];
    if(result){
      question.rate = (result.ok / (result.ok + result.ng)).toFixed(3); ;
    }else{
      result = {ok:0, ng:0};
    }
  }
  var obj = {type:'result', id:questionId, resultMap:resultMap};
  const blob = new Blob([JSON.stringify(obj)], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${questionId}_result.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function reset(){
  for (var question of questions){
    for(var choice of question.choices){
      $(`#question_${question.no}_choice_${choice.id}_label`).removeClass('question-choice-label-correct');
      $(`#question_${question.no}_choice_${choice.id}`).css('background-color', '');
      $(`#question_${question.no}_choice_${choice.id}_check`).prop('checked', false);
    }
  }
}
function sortByScore(){
  $('#datatable').empty();
  var sorted = sortrandom(questions);
  var map = {};
  for(var question of sorted){
    var tmp=map[question.rate];
    if(!tmp){
      tmp=[];
    }
    tmp.push(question);
    map[question.rate] = tmp;
  }
  questions=[];
  var keys=Object.keys(map).sort(function(a, b){ return a-b });
  for(var key of keys){
    for(var question of map[key]){
      questions.push(question);
    }
  }
  createtable();
}
function sortById(){
  $('#datatable').empty();
  questions=questions.sort(function(a,b){
    return a.no - b.no;
  });
  createtable();
}
