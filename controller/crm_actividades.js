'use strict';


var app_angular= angular.module('PedidosOnline');

app_angular.controller("actividadesController",['Conexion','$scope', '$routeParams', '$window',function (Conexion,$scope,$routeParams,$window) {
	$scope.Latitude='';
	$scope.Longitud='';
	var options = {enableHighAccuracy: true, timeout: 4000, maximumAge: 18000000};
	function geolocation()
    {
        
        var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        function onSuccess(position)
        {
        	$scope.Latitude=position.coords.latitude;
			$scope.Longitud= position.coords.longitude;
        }
        function onError(error)
        {
        	alert("Por favor habilitar la Ubicacion, Verificar Conexion a Internet!");
        }
    }
    $scope.Reload=function()
    {
    	location.reload();
    }
    $(document).ready(function () {
        geolocation();
    });
	/*try {
        if (navigator.geolocation) {
	    	navigator.geolocation.getCurrentPosition(function(position){
	        $scope.$apply(function(){
	        	$scope.position = position;
	        	$scope.Longitud=position.coords.longitude;
	        	$scope.Latitude=position.coords.latitude;
		      });
		    },function(error){
		    	$window.alert('Encender Localizacion');
		    	switch(error.code) {
				    case error.PERMISSION_DENIED:
				      alert("User denied the request for Geolocation.")
				      break;
				    case error.POSITION_UNAVAILABLE:
				      alert("Location information is unavailable.")
				      break;
				    case error.TIMEOUT:
				      alert("The request to get user location timed out.")
				      break;
				    case error.UNKNOWN_ERROR:
				      alert("An unknown error occurred.")
				      break;
		  		}
		    });
	  }
	  else 
	  {
	  	alert('Error geo');
	  	$scope.url='error no soportado la localizacion'
	  }
	}
	catch(error) {
		alert(error.message)
	}*/
	$scope.Search;
	$scope.registro=[];
	$scope.terceroSelected;
	$scope.terceroDeTercero=$routeParams.personId;
	CRUD.select('select * from erp_terceros ',
		function(elem)
		{
			$scope.list_tercero.push(elem);
			if ($scope.terceroDeTercero!=undefined   && elem.rowid==$scope.terceroDeTercero) 
			{
				$scope.terceroSelected=elem
				//$scope.Search=$scope.terceroSelected.razonsocial;
				$('#fc_create').click();
			}
		})
	
	

	
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	
	$scope.list_tercero=[];
	
	$scope.horario=[];
	$scope.CurrentDate=function(){
		$scope.day;
		$scope.DayNow=Date.now();
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'/'+$scope.MonthS+'/'+$scope.DayS+' '+$scope.HourS+':'+$scope.MinuteS;
		return $scope.day;
	}
	$scope.selectedDate=function(day){
		$scope.day;
		$scope.DayNow=new Date(day);
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'-'+$scope.MonthS+'-'+$scope.DayS;
		return $scope.day;
	}
	$scope.getHour=function(day){
		$scope.day;
		$scope.DayNow=new Date(day);
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.MinuteS<10) {$scope.MinuteS='0'+$scope.MinuteS}
		if ($scope.HourS<10) {$scope.HourS='0'+$scope.HourS}
		$scope.day=$scope.HourS+':'+$scope.MinuteS;
		return $scope.day;
	}
	$scope.ultimoRegistro=[];
	$scope.events=[];
	$scope.actividades=[];
	$scope.eventSources=[];
	$scope.fechainicial;
	$scope.fechafinal;
	$scope.NuevoEvento=[];
	$scope.listActividadTipo=[];
	$scope.listActividadTipoRelacion=[];
	$scope.listActividadPrioridad=[];
	$scope.listEstadoActividad=[];
	$scope.actividadesDia=[];
	$scope.actividadSelected=[];
	$scope.actividad=[];
	CRUD.select('select * from m_estados where  tipo_estado="ACTIVIDAD"',function(elem){$scope.listEstadoActividad.push(elem)});
	CRUD.select('select * from m_metaclass where  class_code="ACTIVIDAD.TIPO.RELACION" and tipo_reg_nombre="Cliente"',function(elem){$scope.listActividadTipoRelacion.push(elem)});
	CRUD.select('select * from m_metaclass where  class_code="ACTIVIDAD.PRIORIDAD"',function(elem){$scope.listActividadPrioridad.push(elem)});
	CRUD.select('select * from m_metaclass where  class_code="ACTIVIDAD.TIPO"',function(elem){$scope.listActividadTipo.push(elem)});
	$scope.RefrescarVista=function(){


		$scope.eventSources=[];
		$scope.events=[];
		CRUD.select('select rowid,  fecha_inicial, fecha_final,tema,ind_prioridad from crm_Actividades',
		function(elem){
			$scope.actividades.push(elem);
			//hora Inicial
			$scope.fechainicial=new Date(elem.fecha_inicial);
			//Hora Final
			$scope.fechafinal=new Date(elem.fecha_final);
			if (elem.ind_prioridad=='Alta') {
				$scope.events.push({id:elem.rowid,title:elem.tema,start:new Date(elem.fecha_inicial),end:new Date(elem.fecha_final),color:'red'})	
			}
			else if (elem.ind_prioridad=='Media') {
				$scope.events.push({id:elem.rowid,title:elem.tema,start:new Date(elem.fecha_inicial),end:new Date(elem.fecha_final),color:'orange'})	
			}
			else{
				$scope.events.push({id:elem.rowid,title:elem.tema,start:new Date(elem.fecha_inicial),end:new Date(elem.fecha_final),color:'blue'})	
			}
			$scope.eventSources=$scope.events;
			angular.element('#calendar1').fullCalendar('removeEvents');
			angular.element('#calendar1').fullCalendar( 'addEventSource', $scope.eventSources )
			angular.element('#calendar1').fullCalendar('rerenderEvents');
		})
	}
	$scope.abrirModal=function(){
		$('#fc_create').click();
	}
	$scope.guardarActividad=function(){

		var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

        function onSuccess(position)
        {
        	$scope.Latitude=position.coords.latitude;
			$scope.Longitud= position.coords.longitude;
            $scope.EnviarRegistro();
        }
        function onError(error)
        {
        	alert("Por favor habilitar la Ubicacion, Verificar Conexion a Internet!");
        }
        
	}
	$scope.EnviarRegistro=function(){
		$scope.ultimoRegistro=[];
		CRUD.select('select max(rowid) as rowid from crm_actividades',function(elem){$scope.ultimoRegistro.push(elem);
			$scope.ultimoRegistroseleccionado=$scope.ultimoRegistro[0];
			$scope.NuevoEvento.rowid=$scope.ultimoRegistroseleccionado.rowid+1;
			$scope.NuevoEvento.usuario_creacion=$scope.sessiondate.nombre_usuario;
			$scope.NuevoEvento.relacionado_a=$scope.terceroSelected.razonsocial;
			$scope.NuevoEvento.sincronizado='false';
			$scope.NuevoEvento.fecha_inicial=$scope.selectedDate($scope.horario.fechaInicial)+' '+$scope.getHour($scope.horario.horaInicial) ;
			$scope.NuevoEvento.fecha_final=$scope.selectedDate($scope.horario.fechaFinal)+' '+$scope.getHour($scope.horario.horaFinal) ;
			$scope.NuevoEvento.longitud=$scope.Longitud;
			$scope.NuevoEvento.latitud=$scope.Latitude;
			
			$scope.NuevoEvento.fecha_creacion=$scope.CurrentDate();
			CRUD.insert('crm_actividades',$scope.NuevoEvento)
			$scope.NuevoEvento=[];
			$scope.localizacionRegistro=[];
			$scope.localizacionRegistro.latitud=$scope.Latitude;
			$scope.localizacionRegistro.longitud=$scope.Longitud;
			$scope.localizacionRegistro.descripcion='Creacion';
			$scope.localizacionRegistro.rowid_actividad=$scope.ultimoRegistroseleccionado.rowid+1;
			CRUD.insert('crm_localizacion',$scope.localizacionRegistro)
			
			$scope.RefrescarVista();
			$('.antoclose').click();
	        Mensajes('Actividad Nueva Creada','success','');
	        $scope.Longitud='';
        	$scope.Latitude='';
		})
	}
	//Variables Auxiliares
	var started;
    var categoryClass;
    var ended;
	$scope.eventSources=$scope.events;
	$scope.calOptions={
		editable:true,
		selectable: true,
		selectHelper: true,
		header:{
			left:'prev,next today',
			center:'title',
			right:'month,agendaWeek,agendaDay',
			
		},
		select:function(start,end,allDay){
			$('#fc_View').click();
			$scope.ConsultarDia(end);

		},
        eventClick: function (calEvent, jsEvent, view) {
            $('#fc_ViewEvent').click();
            $scope.actividadesDia=[];
			$scope.actividad=[];
			CRUD.select("select * from vw_actividades_usuario where rowid= '"+calEvent.id+"' ",function(elem){
				if (elem.canal=='null') 
				{
					elem.condicion=false;
				}
				$scope.estado=elem.rowid_estado
				$scope.actividad=elem;
			});
            //CRUD.selectParametro('crm_actividades','rowid',calEvent.id,function(elem){$scope.actividadSelected.push(elem);$scope.actividad=$scope.actividadSelected[0]});


        }
	}
	$scope.ActualizarActividad=function(){
		var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        function onSuccess(position)
        {
        	CRUD.Updatedynamic("update crm_actividades set rowid_estado='"+$scope.estado+"',sincronizado='false' where rowid="+$scope.actividad.rowid+"");	
			$scope.localizacionRegistro=[];
			$scope.Latitude=position.coords.latitude;
			$scope.Longitud= position.coords.longitude;
			$scope.localizacionRegistro.latitud=$scope.Latitude;
			$scope.localizacionRegistro.descripcion='Modificacion';
			$scope.localizacionRegistro.longitud=$scope.Longitud;
			$scope.localizacionRegistro.rowid_actividad=$scope.actividad.rowid;
			CRUD.insert('crm_localizacion',$scope.localizacionRegistro)
			$scope.Latitude='';
			$scope.Longitud='';
        }
        function onError(error)
        {
        	alert("Por favor habilitar la Ubicacion, Verificar Conexion a Internet!");
        }
		
	}
	$scope.estado="";
	$scope.ConsultarDia=function(day){
		var Day=new Date(day);
		var YearS=Day.getFullYear();
		var MonthS=Day.getMonth()+1;
		if (MonthS<10) {MonthS='0'+MonthS}
		var DayS=Day.getDate();
		if (DayS<10) {DayS='0'+DayS}
		
		day=YearS+''+MonthS+''+DayS;
		$scope.actividadesDia=[];
		//var query="select  tema,descripcion,fecha_inicial,fecha_final ,replace(fecha_inicial,'-','') as fecha_inicialF,replace(fecha_final,'-','') as fecha_finalF from crm_actividades ";
		CRUD.select("select*from vw_actividades_dia",function(elem){
			var f1 = elem.fecha_inicialF.slice(0,8);
			var f2 = elem.fecha_finalF.slice(0,8);
			f1.replace(' ','');
			f2.replace(' ','');
			if (f1<=day) {
				if (f2>=day) {
					if (elem.canal=='null') 
					{
						elem.condicion=false;
					}
					$scope.actividadesDia.push(elem);
				}
			}
		})
	}
}]);

