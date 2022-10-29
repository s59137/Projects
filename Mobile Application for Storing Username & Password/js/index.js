/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
var db;
document.addEventListener('deviceready', onDeviceReady, true);

function onDeviceReady() {

    //open the database

    db = window.sqlitePlugin.openDatabase({
            name: 'users.db',
            location: 'default'
        },
        function () {
            alert("DB Opened Successfully!");
        },
        function () {

            alert("DB Failed to open!");

        }

    );
    //create a table
    db.transaction(
        function (tx) {
            var query = "CREATE TABLE IF NOT EXISTS studentTb1 (nickname TEXT PRIMARY KEY, name TEXT NOT NULL,phone TEXT NOT NULL)";

            tx.executeSql(query, [],
                function (tx, result) {
                    alert("Table created Successfully!");
                },
                function (err) {
                    alert("error occured:" + err.code);
                }
            );
        }
    );

    db.transaction(function (tx) {
        tx.executeSql('SELECT *FROM studentTb1', [],
            function (tx, results) {
                var len = results.rows.length;

                if (len > 0) {
                    htmlText = "";
                    for (i = 0; i < len; i++) {
                        htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                            "</td><td>" + "<a href='#viewstudent/" + results.rows.item(i).nickname + 
                            "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                    }
                    $('#tblStudent tbody').html(htmlText);
                } else {
                    htmlText = "<tr><td>No data found!</td></tr>"
                    $('#tblStudent tbody').html(htmlText);
                }
                $('#tbtStudentList').show();
            });
    });




}

$(document).ready(function () {
    $("#divAddStdBtn").show();
    //hasher
    function parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    }
    hasher.initialized.add(parseHash); //parse initial hash
    hasher.changed.add(parseHash); //parse hash changes
    hasher.init(); //start listening for history change
    hasher.setHash(link1);
    hasher.setHash(link2);
    hasher.setHash(link3);
    hasher.setHash(link4);


    var link1 = crossroads.addRoute('/sqliteclick', function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM studentTb1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                            "</td><td>" + "<a href='#viewstudent/" + results.rows.item(i).nickname + 
                            "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tblStudent tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblStudent tbody').html(htmlText);
                    }
                    $('#tbtStudentList').show();
                });
        });
        $("#divStudentList").show();
        $("#divFrmShowStudent").hide();
        $("#divFrmInputStudent").hide();
        $("#divFrmEditStudent").hide();
    });

    var link2 = crossroads.addRoute('viewstudent/{nickname}', function (nickname) {

        alert("click on student nickname success! nickname=" + nickname);

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM studentTb1 where nickname = ?', [nickname],
                function (tx, results) {

                    
                    var nickname = String(results.rows.item(0).nickname);
                    var name = String(results.rows.item(0).name);
                    var phone = String(results.rows.item(0).phone);
                    

                    $("#studentidshow").val(nickname);
                    $("#studentnameshow").val(name);
                    $("#studentphoneshow").val(phone);
                    var editId = String("#btnEdit/" + nickname)
                    $("#idShowStudent").attr("href", editId)
                    var DeleteId = String("#btnDelete/" + nickname)
                    $("#idDeleteStudent").attr("href", DeleteId)
                });
        });

        $("#divStudentList").hide();
        $("#divFrmShowStudent").show();

    });

    var link3 = crossroads.addRoute('btnAddStudent', function () {
        //code here
        $("#divStudentList").hide();
        $("#divFrmShowStudent").hide();
        $("#divFrmInputStudent").show();
    });

    var link4 = crossroads.addRoute('btnEdit/{nickname}', function (nickname) {
        alert("click on student nickname success! nickname=" + nickname);
        var ids = String(parseInt(nickname));

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM studentTb1 where nickname = ?', [ids],
                function (tx, results) {

                    var nickname = String(results.rows.item(0).nickname);
                    var name = String(results.rows.item(0).name);
                    var phone = String(results.rows.item(0).phone);

                    $("#studentidedit").val(nickname);
                    $("#studentnameedit").val(name);
                    $("#studentphoneedit").val(phone);
                });
        });

        $("#divFrmShowStudent").hide();
        $("#divFrmEditStudent").show();

    });

    var link5 = crossroads.addRoute('btnDelete/{nickname}', function (nickname) {
        var ids = String(parseInt(id));

        db.transaction(function (tx) {
            var result = confirm("Want to delete?");
            if (result) {
                tx.executeSql('DELETE FROM studentTb1 where nickname = ?', [nickname],
                function (tx, results) {
                    alert("Student is deleted");
                });
            } else {
                alert("account not deleted")
            }
            
        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM studentTb1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                            "</td><td>" + "<a href='#viewstudent/" + results.rows.item(i).nickname + 
                            "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tblStudent tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblStudent tbody').html(htmlText);
                    }
                    $('#tbtStudentList').show();
                });
        });

        $("#divFrmShowStudent").show();
        $("#divFrmEditStudent").hide();

    });

    $("#divFrmInputStudent").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var nickname = $("#studentidinput").val();
        var name = $("#studentnameinput").val();
        var phone = $("#studentphoneinput").val();

        //db transaction
        db.transaction(function (tx) {
            var query = "INSERT INTO studentTb1 (nickname, name, phone) values(?, ?, ?)";
            tx.executeSql(query, [nickname, name, phone],

                function (tx, results) {
                    alert("Data Inserted!");
                    $("#divStudentList").show();
                    $("#divFrmShowStudent").hide();
                    $("#divFrmInputStudent").hide();
                },
                function (error) {
                    alert("Error, try again!");
                }
            );
        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM studentTb1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                            "</td><td>" + "<a href='#viewstudent/" + results.rows.item(i).nickname + 
                            "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tblStudent tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblStudent tbody').html(htmlText);
                    }
                    $('#tbtStudentList').show();
                });
        });
    });

    $("#divFrmEditStudent").submit(function (e) {
        e.preventDefault();
        e.stopPropagation();

        //get the value from form
        var nickname = $("#studentidedit").val();
        var name = $("#studentnameedit").val();
        var phone = $("#studentphoneedit").val();


        //db transaction
        db.transaction(function (tx) {
            var query = "UPDATE studentTb1 set name=?,phone=? where nickname=?";
            tx.executeSql(query, [name, phone, nickname],

                function (tx, results) {
                    alert("Data Updated!");
                    $("#divStudentList").show();
                    $("#divFrmShowStudent").hide();
                    $("#divFrmEditStudent").hide();
                    $("#divFrmInputStudent").hide();
                },
                function (error) {
                    alert("Error, try again!");
                }
            );
        });

        db.transaction(function (tx) {
            tx.executeSql('SELECT *FROM studentTb1', [],
                function (tx, results) {
                    var len = results.rows.length;

                    if (len > 0) {
                        htmlText = "";
                        for (i = 0; i < len; i++) {
                            htmlText = htmlText + "<tr><td>" + results.rows.item(i).nickname +
                            "</td><td>" + "<a href='#viewstudent/" + results.rows.item(i).nickname + 
                            "'>" + "<span class='glyphicon glyphicon-chevron-right' style='float:right;'></span></a>" + "</td></tr>";
                        }
                        $('#tblStudent tbody').html(htmlText);
                    } else {
                        htmlText = "<tr><td>No data found!</td></tr>"
                        $('#tblStudent tbody').html(htmlText);
                    }
                    $('#tbtStudentList').show();
                });
        });
    });

});