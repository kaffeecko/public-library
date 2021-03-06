
/* Controllers */

var publicLibraryControllers = angular.module('publicLibraryControllers', []);


/***************************************************************************************************
 ***************************************************************************************************
 * # BooksController:
 * - for showAllBooks, addBook, updateBook and destroyBook.
 *
 * @param  {Object} $scope      [glue between view/model and controller]
 * @param  {Object} $location   [control the url]
 * @param  {Object} $http       [get connection with parse.com using REST Api]
 **************************************************************************************************/
publicLibraryControllers.controller('BooksController', ['$scope', '$location', '$http',
  function ( $scope, $location, $http) {

    /**
     * ## showLoading
     * - once the page is loaded, only show progressbar, which will be hidden after loaded all data,
     *   and the rest content of this page will be shown;
     */
    $scope.showLoading = true;

    /**
     * ## getAllBooks
     * - sent a GET request to parse.com once the controller is loaded. If the request is succeed,
     *   all books stored in parse.com will be loaded and saved to an array $scope.books; otherwise,
     *   show error messages in console.
     */
    $scope.getAllBooks = function () {
      $http({
        method: 'GET',
        url: 'https://api.parse.com/1/classes/Book'
      })
        .success( function ( data) {
          $scope.showLoading = false;
          $scope.books = data.results;
        })
        .error( function ( data) {
          console.log( data);
          alert("OH! Can NOT get all books, see the information in console.");
        });
    };

    /**
     * ## addBook
     * - send a POST request to parse.com for inserting a new book record which stored in
     *   $scope.book to parse.com. If the request is succeed, clear all the temporary data and jump
     *   to parent page; otherwise, show error messages in console.
     */
    $scope.addBook = function () {
      $http({
        method: 'POST',
        url: 'https://api.parse.com/1/classes/Book',
        data: {
          isbn: $scope.book.isbn,
          title: $scope.book.title,
          year: $scope.book.year
        }
      })
        .success( function () { $location.path('/');})
        .error( function ( data) {
          console.log( data);
          alert("OH! Book is NOT added, see the information in console.");
        });
    };

    /**
     * ## updateBook
     * - send a PUT request to parse.com for changing book record, which has a standard objectId
     *   defined by parse.com itself and stored in $scope.book, to parse.com. If the request is
     *   succeed, clear all the temporary data and jump to parent page; otherwise, show error
     *   messages in console.
     */
    $scope.updateBook = function () {
      var bookUrl = 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId;
      $http({
        method: 'PUT',
        url: bookUrl,
        data: {
          isbn: $scope.book.isbn,
          title: $scope.book.title,
          year: $scope.book.year
        }
      })
        .success( function () { $location.path('/');})
        .error( function ( data){
          console.log( data);
          alert("OH! Book is NOT updated, see the information in console.");
        });
    };

    /**
     * ## destroyBook
     * - send a DELETE request to parse.com for deleting a book record which has a standard objectId
     *   defined by parse.com itself. If the request is succeed, jump to parent page; otherwise,
     *   show error messages in console.
     */
    $scope.destroyBook = function () {
      var bookUrl = 'https://api.parse.com/1/classes/Book/' + $scope.book.objectId;
      $http( {
        method: 'DELETE',
        url: bookUrl
      })
        .success( function () { $location.path('/');})
        .error( function ( data) {
          console.log( data);
          alert("Book is NOT deleted. Something goes wrong... see the information in console.");
        });
    };
  }]);


/*==================================================================================================
 *==================================================================================================
 * # TestDatasController
 * - for creating and clearing test data.
 **************************************************************************************************/
publicLibraryControllers.controller('TestDatasController',
  ['$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
      // Create test data.
      $scope.createTestData = function () {
        $scope.clearDatabase();
        $timeout( function () {
          // basic data from author, publisher and book
          $http({
            method: 'POST',
            url: 'https://api.parse.com/1/batch',
            data: {
              requests: [
                // Create Test Data for Books
                {
                  method: 'POST',
                  path: '/1/classes/Book',
                  body: {
                    isbn: "0553345842",
                    title: "The Mind's I",
                    year: 1982
                  }
                },
                {
                  method: 'POST',
                  path: '/1/classes/Book',
                  body: {
                    isbn: "1463794762",
                    title: "The Critique of Pure Reason",
                    year: 2011
                  }
                },
                {
                  method: 'POST',
                  path: '/1/classes/Book',
                  body: {
                    isbn: "1928565379",
                    title: "The Critique of Practical Reason",
                    year: 2009
                  }
                },
                {
                  method: 'POST',
                  path: '/1/classes/Book',
                  body: {
                    isbn: "0465030793",
                    title: "I Am A Strange Loop",
                    year: 2000
                  }
                }
              ]
            }
          })
            .success( function () {
              console.log("added 4 books");
            })
            .error( function ( data) {
              console.log( data);
              alert("OH! Something goes wrong. See the information in console.");
            });
        }, 2000);
      };

      // Clear all test data.
      $scope.clearDatabase = function () {
        // Clear all Book Data
        $http({
          method: 'GET',
          url: 'https://api.parse.com/1/classes/Book'
        })
          .success( function ( data) {
            var obs = data.results;
            obs.forEach( function ( ob) {
              $http({
                method: 'DELETE',
                url: 'https://api.parse.com/1/classes/Book/' + ob.objectId
              })
                .error( function ( data, status, headers, config) {
                  alert("OH! Something goes wrong. See the information in console.");
                  console.log( data, status, headers, config);
                });
            });
            console.log("clear all book data.");
          })
          .error( function ( data, status, headers, config) {
            alert("OH! Something goes wrong. See the information in console.");
            console.log( data, status, headers, config);
          });
      };
    }]);
