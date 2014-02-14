'use strict';
var EditorHelper = require('../../lib/editor-helper.js').EditorHelper;
var AssertsHelper = require('../../lib/asserts-helper.js').AssertsHelper;
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var ConsoleHelper = require('../../lib/console-helper.js').ConsoleHelper;

describe('Embedded-console',function(){
  var editor = new EditorHelper();
  var designerAsserts= new AssertsHelper();
  var shelf = new ShelfHelper();
  var apiConsole = new ConsoleHelper();

  describe('Resource Group - expand/collapse all', function(){
    it('expanded by default - 1 resource and nested resource', function (){
      var definition = [
        '#%RAML 0.8',
        'title: console restyling',
        '/res1:',
        '  /res1.1:',
        '            '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('console restyling');
      var expList = ['/res1','/res1 /res1.1'];
      designerAsserts.consoleResourceName(expList);
      designerAsserts.consoleResourceGroupCollapsedExpanded(apiConsole.resourceGroupExpandedClass);
    });

    it('collapse all resource group - 1 resource', function(){
      apiConsole.expandCollapseAllResourcesGroupPromise('collapse').then(function(){
        designerAsserts.consoleResourceGroupCollapsedExpanded(apiConsole.resourceGroupCollapsedClass);
      });
    });

    it('expand all resource group - 1 resource', function(){
      apiConsole.expandCollapseAllResourcesGroupPromise('expand').then(function(){
        designerAsserts.consoleResourceGroupCollapsedExpanded(apiConsole.resourceGroupExpandedClass);
      });
    });

    it('add a new resource and exapnd all', function(){
      apiConsole.expandCollapseAllResourcesGroupPromise('collapse').then(function(){
        designerAsserts.consoleResourceGroupCollapsedExpanded(apiConsole.resourceGroupCollapsedClass);
      });
      editor.setLine(5, '/res2: \\n  /res2.1:\\n       ');
      designerAsserts.consoleResourceGroupCollapsedExpandedArray([apiConsole.resourceGroupCollapsedClass, apiConsole.resourceGroupExpandedClass]);
      apiConsole.expandCollapseAllResourcesGroupPromise('collapse').then(function(){
        designerAsserts.consoleResourceGroupCollapsedExpanded(apiConsole.resourceGroupCollapsedClass);
      });
      apiConsole.expandCollapseAllResourcesGroupPromise('expand').then(function(){
        designerAsserts.consoleResourceGroupCollapsedExpanded(apiConsole.resourceGroupExpandedClass);
      });
    });
  });

  describe('ResourceType Traits information', function(){
// checking on multiples resources.

    it('resource type information is not displayed on the collapsed resource', function(){
      var definition = [
        '#%RAML 0.8',
        'title: raml with resources',
        'resourceTypes: ',
        '  - restyp1: ',
        '      description: res1 description',
        '      get: ',
        '        responses:',
        '          200: ',
        '            description: 200 ok',
        '/res1:',
        '  type: restyp1',
        '         '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('raml with resources');
      designerAsserts.isResourceCollapsedByPos(1).then(function(){
        designerAsserts.consoleResourceResourceType(['']);
      });
    });

    it('resource type information is displayed on the expanded resource', function(){
      apiConsole.expandCollapseResourcebyPos(1).then(function(){
        designerAsserts.consoleResourceResourceType(['restyp1']);
      });
    });

    it('traits information is not displayed on the collapsed resource - single trait', function(){
      var definition = [
        '#%RAML 0.8',
        'title: raml with traits',
        'traits:',
        '  - trait1:',
        '      description: this is trait1',
        '  - trait2: ',
        '      description: this is trait2 description',
        '/pos1:',
        '  is: ',
        '    - trait1',
        '           '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('raml with traits');
      designerAsserts.isResourceCollapsedByPos(1).then(function(){
        var expList = {
          'r0':['']
        };
        designerAsserts.consoleResourceTraits(expList);
      });
    });

    it('trait information applied at resource level is displayed on the expanded resourcce -  single trait', function(){
      apiConsole.expandCollapseResourcebyPos(1).then(function(){
        var expList = {
          'r0':['trait1']
        };
        designerAsserts.consoleResourceTraits(expList);
      });
    });

    it('traits information is not displayed on the collapsed resource - 2 traits', function(){
      var definition = [
        '#%RAML 0.8',
        'title: raml with traits 2',
        'traits:',
        '  - trait1:',
        '      description: this is trait1',
        '  - trait2: ',
        '      description: this is trait2 description',
        '/pes1:',
        '  is: ',
        '    - trait1',
        '    - trait2'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('raml with traits 2');
      designerAsserts.isResourceCollapsedByPos(1).then(function(){
        var expList = {
          'r0':['', '']
        };
        designerAsserts.consoleResourceTraits(expList);
      });


    });

    it('trait information applied at resource level is displayed on the expanded resourcce -  2 traits', function(){
      apiConsole.expandCollapseResourcebyPos(1).then(function(){
        var expList = {
          'r0':['trait1','trait2']
        };
        designerAsserts.consoleResourceTraits(expList);
      });
    });

    it('trait information applied at method level is displayed on expanded method - single trait', function(){
      var definition = [
        '#%RAML 0.8',
        'title: raml with traits at method level',
        'traits:',
        '  - trait1:',
        '      description: this is trait1',
        '  - trait2: ',
        '      description: this is trait2 description',
        '/pos1:',
        '  get:',
        '    is: ',
        '      - trait1',
        '             '
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('raml with traits at method level');
      apiConsole.expandCollpaseMethodsbyPos(1);
      designerAsserts.consoleValidateCurrentMethodName('GET');
      designerAsserts.consoleValidateMethodTraits(['trait1']);
      apiConsole.closeMethodPopUp();
    });

    it('trait information applied at method level is displayed on expanded method 2 traits', function(){
      var definition = [
        '#%RAML 0.8',
        'title: raml with traits at method level',
        'traits:',
        '  - trait1:',
        '      description: this is trait1',
        '  - trait2: ',
        '      description: this is trait2 description',
        '/posi1:',
        '  post:',
        '    is: [trait1,trait2]'
      ].join('\\n');
      editor.setValue(definition);
      designerAsserts.consoleApiTitle('raml with traits at method level');
      apiConsole.expandCollpaseMethodsbyPos(1);
      designerAsserts.consoleValidateCurrentMethodName('POST');
      designerAsserts.consoleValidateMethodTraits(['trait1','trait2']);
      apiConsole.closeMethodPopUp();
    });

  });

  describe('generals', function(){

    it('it is not displayed if are parser errors', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My API',
        '/resss: ',
        '  get: ',
        '  /ressss2:'
      ].join('\\n');
      editor.setValue(definition);
      var embeddedConsole = browser.findElement(by.css('[role="console"]'));
      expect(embeddedConsole.getAttribute('class')).toEqual('');
      editor.setLine(5,'  resss2:');
      expect(embeddedConsole.getAttribute('class')).not.toContain('ng-hide');
    });

    describe('verify parser response on the console', function(){
      it('using alias', function(){
        var definition = [
          '#%RAML 0.8 ',
          'title: My api',
          '/resource1: &res1',
          '  description: this is resource1 description',
          '  /resource2: *res1'
        ].join('\\n');
        editor.setValue(definition);
        var expList = ['/resource1','/resource1 /resource2'];
        designerAsserts.consoleResourceName(expList);
        apiConsole.toggleResourceExpansion();
        var expDescriptions = ['this is resource1 description','this is resource1 description'];
        designerAsserts.consoleResourceDescription(expDescriptions);
      });
    }); // verify parser response on the console

  });// generals

  describe('partial Refresh', function(){

    it('clear editor', function(){
      editor.setValue('');
      expect(editor.getLine(1)).toEqual('');
      designerAsserts.shelfElements(shelf.elemRamlVersion);
      expect(editor.IsParserErrorDisplayed()).toBe(false);
    });

    describe('expand method', function(){

      it('resource description', function(){
        var definition = [
          '#%RAML 0.8',
          'title: My API it this ',
          '/presentations:  \\n        '
        ].join('\\n');
        editor.setValue(definition);
        apiConsole.toggleResourceExpansion();
        editor.setLine(4,'  description: this is presentation resource description \\n     ');
        designerAsserts.consoleResourcesDescription(['this is presentation resource description']);
      });

    });

  }); // partial refresh


  describe('documentation section', function(){

    it('toggle between views (documentation and api reference', function(){
//      this test verify that by default the documentation section is hidden
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'documentation:',
        '  - title: My docs1',
        '    content: | ',
        '      content of my doc1',
        '/presentation: ',
        '  description: presentation resource description'
      ].join('\\n');
      editor.setValue(definition);
      apiConsole.toggleDocumentationApiReference('documentation');
      apiConsole.getListMainResources().then(function(list){
        expect(list.length).toEqual(0);
      });
      apiConsole.toggleDocumentationApiReference('api');
      apiConsole.getListMainResources().then(function(list){
        expect(list.length).toEqual(1);
      });
    });

    it('check documentation view', function(){
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'documentation:',
        '  - title: My docs1',
        '    content: | ',
        '      content of my doc1',
        '  - title: My docs2',
        '    content: content of my doc2',
        '/presentation: ',
        '  description: presentation resource description'
      ].join('\\n');
      editor.setValue(definition);
      var expTitle = ['My docs1', 'My docs2'];
      var expContent = ['content of my doc1','content of my doc2' ];
      apiConsole.toggleDocumentationApiReference('documentation');
      apiConsole.getListMainResources().then(function(list){
        expect(list.length).toEqual(0);
      });
      designerAsserts.consoleValidateDocumentationSectionPlainText(expTitle, expContent);
      apiConsole.toggleDocumentationApiReference('api');
    });

    xit('current raml with documentation section - change to a raml without documentation section  - console should be displayed.',function(){
//    https://www.pivotaltracker.com/story/show/65812464
      var definition = [
        '#%RAML 0.8',
        'title: My api',
        'documentation:',
        '  - title: My document title1',
        '    content: | ',
        '      content of my doccument title 1',
        '  - title: My document title2',
        '    content: content of my document title 2',
        '/documentation: ',
        '  description: presentation resource description'
      ].join('\\n');
      editor.setValue(definition);
      var expTitle = ['My document title1', 'My document title2'];
      var expContent = ['content of my doccument title 1','content of my document title 2' ];
      apiConsole.toggleDocumentationApiReference('documentation');
      apiConsole.getListMainResources().then(function(list){
        expect(list.length).toEqual(0);
      });
      designerAsserts.consoleValidateDocumentationSectionPlainText(expTitle, expContent).then(function(){
        definition = [
          '#%RAML 0.8',
          'title: api without documentation',
          '/oneresource:',
          '  description: this is oneresource description'
        ].join('\\n');
        editor.setValue(definition);
        designerAsserts.consoleResourceName(['oneresource']);
      });
    });

    xdescribe('Markdown', function(){

      it('validate titles',function(){

      });

      it('validate lists', function(){

      });

    });//Markdown
  });//documentation section

});// Embedded-console
