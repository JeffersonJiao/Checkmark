$(document).ready(()=>{
  
    var socket = io.connect('http://localhost:3000/');

    $("#menu").on('click',()=>{
        $("#myNav").css({
            width: '100%',
        })
    });

    $(document).on('click',(e)=>{
        if(e.target.id == 'myNav'){
            $("#myNav").css({
                width: '0%',
            })
        }
    });
    $("#gotoCode").on('submit',(e)=>{
        e.preventDefault();

        socket.emit('goto other',{
            checkmarkcode: $("#gtcmcode").val(),
        });

        $.ajax({
            type: "POST",
            url: '/other',
            dataType: 'json',
            success: (result)=>{
               
            },
          });
    });

    $("#addItemForm").on('submit',(e)=>{
        e.preventDefault();
        var data ={};
        data.item = $("#addInput").val();
        if(data.item != ""){
            $.ajax({
                type: "POST",
                url: '/',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: (results)=>{
                    var result = results[0];
                    var user_id =  results[1];
                    $("#homeList").empty();
                    var append = "";
                   for(var i = 0 ; i < result.length ; i++){
                    if(result[i].poster_id == user_id){
                        result[i].poster_name = 'You';
                    }
                    append = append + "<div class='list-data-wrapper'>" + result[i].item + "<br><small>Added by: " + result[i].poster_name + 
                    "</small><form><div class='form-group form-group-sm'><button class='trash' type='submit'></button></div>" +
                    "<input type='hidden' name='selecteditem' value='<%=lists[i].id %>'/>" +
                    "</form><hr/></div>";
                   }
                   $("#homeList").html(append);
                   $("#addInput").val('');
                },
              });
        }
    });

    $("#refreshCode").on('submit',(e)=>{
        e.preventDefault();
        $('#refreshCode button').attr('disabled','disabled');
       
        $.ajax({
            type: "POST",
            url: '/getcode',
            dataType: 'json',
            success: (result)=>{
                $("#cmcode").html(result);
                setTimeout(()=>{
                    $('#refreshCode button').removeAttr('disabled');
                },3000);
            },
          });
    });
});