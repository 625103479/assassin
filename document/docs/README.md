# 离职交接文档(业务模块交接)

## 业务模块交接

### Vue工程

- Vue工程所用技术栈

  - 一下代码为代码直接引入

  	- avue-plugin-ueditor

    一款基于vue-quill-editor的富文本富文本组件封装，最低版本0.0.9。 表单设计器中提示文本对其有使用

  	- js-cookie

    一款对cookie操作进行封装的第三方插件 最低版本 2.2.0

  - 以下组件为cdn引入，减小webpack打包后体积

    - avue

      一款基于element-ui vue 二次封装的快速开发crud组件，最低版本 2.8.12，[官方文档](https://www.avuejs.com/)

    - echarts

      一快开发开发图标的前端组件，最低版本4.2.1 [官方文档](https://echarts.apache.org/zh/index.html)

    - Axios 

      Axios 是一个基于 promise 的 HTTP 库,最低依赖版本 0.18.0

    - vue

      一款前端MVVM框架，最低版本 2.5.16，项目不兼容Vue3.0及以上，该版本慎重调整

    - vue-router

      Vue路由控制插件，最低版本3.0.1

    - vuex

      Vue全局数据状态管理工具 最低版本3.0.1

    - Element-ui  

      一款基于Vue的组件库，最低依赖版本 2.4.5 [官方文档](https://element.eleme.cn/#/zh-CN/component/installation)

- Vue工程项目地址

  Vue工程位于后端工程中，以一个项目模块的方式嵌入到java工程的源代码中，项目源代码位于**follow_visit\follow_visit\hcrm-architecture\hcrm-base-support\hcrm-vue**中

- Vue工程打包

  在项目根目录执行yarn run build就可以进行打包，打包后的静态资源位于**'../hcrm-sys/src/main/webapp/assets/vue'**，直接提交即可。

- Vue工程相关注意事项

  - **打包注意事项**
  
    - 需要关闭**src/system/config.js**中url代理前缀
  
  - **开发注意事项**
  
    - 由于前后端分离，可能会导致跨域、登录凭证无法传递等不可预料的事情，所以Vue项目在开发过程中调用后端接口采用代理的方式进行。在开发过程中，所有请求后端的接口都加上/api前缀 该配置位于**src/system/config.js**中，配置baseUrl即可。
  
    - 在项目根目录**vue.config.js**中有配置代理的地方，代理会截取**/api**前缀的接口，进行转发，在该配置文件中有配置项为**devServer**的配置选项，选项中有对代理请求进行hearder头部处理，会根据头部配置的Coookie来达到认证的效果。
  
      ```javascript
       devServer: {
          host: '0.0.0.0',
          // 端口号
          port: 8080, 
          proxy: {
            '/api': {
              // 要访问的接口域名
              target: 'http://localhost:9081/', 
              changeOrigin: true,
              headers: {
                Cookie:    'Authorization=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjI2MTA2NDg5LCJ1c2VySWQiOjEsImlhdCI6MTYyNTEwNjQ5MCwiYWNjb3VudCI6ImFkbWluIiwidXNlcktleSI6Inh4eHgifQ.3LP5yC6yMSCk2PModUB4wgTaEG3iJFykoty0Mx_DBeNiD1gz8V9C3e2bzHQMpX1bnVvyrwHFuMDNXbckIdEQpg',
              },
              pathRewrite: {
                '^/api': ''
              }
            }
          }
        }
      ```



### Java工程

- Java工程代码位置

  - java公司代码位于 **follow_visit\follow_visit\hcrm-architecture\hcrm-base-support\hcrm-sys\src\main\java\cn\stylefeng\guns\sys\modular\vue** 中，此包中代码全部为vue工程所使用到的代码

  - 在**follow_visit\follow_visit\hcrm-architecture\hcrm-main\src\main\resources\MybatisPlusGeneratortemplates**目录下存放着**follow_visit\follow_visit\hcrm-architecture\hcrm-main\src\test\java\MybatisPlusGenerator.java**该代码生成器所需要的前端后端代码生成模板！

- Java工程注意事项

  * 使用**follow_visit\follow_visit\hcrm-architecture\hcrm-main\src\test\java\MybatisPlusGenerator.java**生成代码，代码会自动生成到**ollow_visit\follow_visit\hcrm-architecture\hcrm-base-support\hcrm-sys\src\main\java\cn\stylefeng\guns\sys\modular\vue****中

### 单表代码生成

#### 	功能概述

​		该功能能够根据数据库表字段设计（字段、字段注释、表注释、表名）生成对应的Controller、Service、ServiceImpl、Mapper等文件，生成的代码中会自动携带保存或新增、删除、分页查询、条件查询等接口。

  - 保存或新增

       - Controller

         ```java
          @ApiOperation(value = "保存或新增", httpMethod = "POST")
             @RequestMapping(path = {"/saveOrUpdate"}, produces = {"application/json"}, method = {RequestMethod.POST})
             public ResultInfo getOrgDic(@RequestBody HisDictEntity entity) {
                 businessService.saveOrUpdate(entity, WebUtils.getLoginUser());
                 return ResultInfoBuilder.success("成功");
             }
         ```

       - Service

         ```java
         void saveOrUpdate(HisDictEntity entity, LoginUser loginUser);
         ```
         
       - ServiceImpl

         ```java
              @Override
             @Transactional(rollbackFor = RuntimeException.class)
             public void saveOrUpdate(HisDictEntity entity, LoginUser loginUser) {
                 entity.setYyid(loginUser.getHospitalId()).setScbz(0);
                 if (Objects.nonNull(entity.getId())) {
                     entity.setUpdateUser(loginUser.getId()).setUpdateTime(new Date());
                 } else {
                     entity.setCreateUser(loginUser.getId()).setCreateTime(new Date());
                 }
                 Utils.validBean(entity);
                 this.saveOrUpdate(entity);
             }
         ```

         

  - 删除数据

      - Controller

        ```java
            @ApiOperation(value = "根据idList 删除数据", httpMethod = "POST")
            @RequestMapping(path = {"/deleteByIdList"}, produces = {"application/json"}, method = {RequestMethod.POST})
            public ResultInfo deleteByIdList(@RequestBody List<Long> idList) {
                businessService.deleteByIdList(idList, WebUtils.getLoginUser());
                return ResultInfoBuilder.success("成功");
            }
        ```

      - Service

        ```java
         void deleteByIdList(@NotEmpty(message = "idList不能为空") List<Long> idList, LoginUser loginUser);
        ```

      - ServerImpl

        ```java
            @Override
            @Transactional
            public void deleteByIdList(List<Long> idList, LoginUser loginUser) {
                this.updateBatchById(idList.stream().map(item -> HisDictEntity.builder().id(item).scbz(1).build()).collect(Collectors.toList()));
            }
        ```

  - 分页查询数据

      - Controller

        ```java
            @ApiOperation(value = "查询list", httpMethod = "POST")
            @RequestMapping(path = {"/list"}, produces = {"application/json"}, method = {RequestMethod.POST})
            public ResultInfo<List<HisDictEntity>> list(@RequestBody ListCondition<HisDictEntity> listCondition) {
                return ResultInfoBuilder.success("成功", businessService.list(listCondition, WebUtils.getLoginUser()));
            }
        ```

      - Service

        ```java
           IPage<HisDictEntity> query(@Valid QueryCondition<HisDictEntity> queryCondition, LoginUser loginUser);
        ```

      - ServiceImpl

        ```java
             @Override
            public IPage<HisDictEntity> query(QueryCondition<HisDictEntity> queryCondition, LoginUser loginUser) {
                QueryWrapper<HisDictEntity> query = Wrappers.query(queryCondition.getEntity());
                query.eq("yyid", loginUser.getHospitalId());
                queryCondition.generalProcessing(query);
                return this.page(queryCondition.gainPage(), query);
            }
        ```

  -  条件查询数据

      - Controller

        ```java
            @ApiOperation(value = "查询list", httpMethod = "POST")
            @RequestMapping(path = {"/list"}, produces = {"application/json"}, method = {RequestMethod.POST})
            public ResultInfo<List<HisDictEntity>> list(@RequestBody ListCondition<HisDictEntity> listCondition) {
                return ResultInfoBuilder.success("成功", businessService.list(listCondition, WebUtils.getLoginUser()));
            }
        ```

      - Service

        ```java
         List<HisDictEntity> list(@Valid ListCondition<HisDictEntity> listCondition, LoginUser loginUser);
        ```

      - ServiceImpl

        ```java
            @Override
            public List<HisDictEntity> list(ListCondition<HisDictEntity> listCondition, LoginUser loginUser) {
                QueryWrapper<HisDictEntity> query = Wrappers.query(listCondition.getEntity());
                listCondition.generalProcessing(query);
                return this.list(query);
            }
        ```
      
  - 前端代码生成

      代码位于**follow_visit\hcrm-architecture\hcrm-base-support\hcrm-sys\src\main\java\cn\stylefeng\guns\sys\modular\vue\core\develop**

      - Controller

        ```java
        @ApiOperation(value = "根据实体生成前端表格配置", httpMethod = "GET")
        @ApiImplicitParams({
                @ApiImplicitParam(name = "classFullPathName", value = "类全路径名", dataType = "String", required = true)
        })
        @RequestMapping(path = {"/generateTableConfig"}, produces = {"application/json"}, method = {RequestMethod.GET})
        public void addRelation(String classFullPathName, HttpServletResponse response) {
            String resultString = developService.generateTableConfig(classFullPathName);
            String[] split = classFullPathName.split("\\.");
            
            String fileName = (split.length > 0 ? split[split.length - 1] : "未知的文件") + ".vue";
            OutputStream os = null;
            try {
                response.reset();
                response.setContentType("application/octet-stream; charset=utf-8");
                response.setHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes(), "ISO8859-1"));
                byte[] bytes = resultString.toString().getBytes("UTF-8");
                os = response.getOutputStream();
                // 将字节流传入到响应流里,响应到浏览器
                os.write(bytes);
                os.close();
            } catch (Exception ex) {
                throw new ServiceException(500, "文件输出失败:" + ex.getMessage());
            } finally {
                try {
                    if (null != os) {
                        os.close();
                    }
                } catch (IOException ioEx) {
                }
            }
        }
        ```

      - Service

        ```java
        String generateTableConfig(@NotBlank(message = "类全路径名不能为空") String classFullPathName);
        ```

      - ServiceImpl

        ```java
        @Override
        public String generateTableConfig(String classFullPathName) {
        
            try {
                List<String> fieldList = new ArrayList<>();
                AtomicReference<String> idName = new AtomicReference();
                Class<?> aClass = Class.forName(classFullPathName);
                Field[] fields = aClass.getDeclaredFields();
                List<HashMap<Object, Object>> column = Arrays.asList(fields).stream().filter(field -> {
                    field.setAccessible(true);
                    return !"serialVersionUID".equals(field.getName());
                }).map(field -> {
                    String prop = field.getName();
                    // 字段加入字段集合
                    fieldList.add(prop);
                    TableId tableIdAnnotation = field.getAnnotation(TableId.class);
                    // 查找主键
                    if (Objects.nonNull(tableIdAnnotation)) {
                        idName.set(prop);
                    }
                    ApiModelProperty apiModelPropertyAnnotation = field.getAnnotation(ApiModelProperty.class);
                    String label = Objects.isNull(apiModelPropertyAnnotation) ? "未命名字段" : apiModelPropertyAnnotation.value();
        
                    ArrayList<HashMap<Object, Object>> rules = new ArrayList<>();
        
                    // 是否必填校验
                    NotNull notNullAnnotation = field.getAnnotation(NotNull.class);
                    if (Objects.nonNull(notNullAnnotation)) {
                        HashMap<Object, Object> rule = new HashMap<>();
                        rule.put("required", true);
                        rule.put("message", StringUtils.isBlank(notNullAnnotation.message()) ? String.format("请填%s", label) : notNullAnnotation.message());
                        rules.add(rule);
                    }
                    NotBlank NotBlankAnnotation = field.getAnnotation(NotBlank.class);
                    if (Objects.nonNull(NotBlankAnnotation)) {
                        HashMap<Object, Object> rule = new HashMap<>();
                        rule.put("required", true);
                        rule.put("message", StringUtils.isBlank(NotBlankAnnotation.message()) ? String.format("请填%s", label) : NotBlankAnnotation.message());
                        rules.add(rule);
                    }
        
                    HashMap<Object, Object> resultHashMap = new LinkedHashMap<>();
                    resultHashMap.put("prop", prop);
                    resultHashMap.put("label", label);
                    resultHashMap.put("overHidden", true);
                    if (!rules.isEmpty()) {
                        resultHashMap.put("rules", rules);
                    }
                    return resultHashMap;
        
                }).collect(Collectors.toList());
                HashMap<Object, Object> returnHashMap = new LinkedHashMap<>();
                returnHashMap.put("height", "auto");
                returnHashMap.put("calcHeight", 45);
                returnHashMap.put("align", "center");
                returnHashMap.put("menuAlign", "center");
                returnHashMap.put("column", column);
                returnHashMap.put("overHidden", true);
                returnHashMap.put("searchIndex", 3);
                returnHashMap.put("searchIcon", true);
                returnHashMap.put("searchMenuSpan", 6);
                returnHashMap.put("stripe", true);
                returnHashMap.put("selection", true);
                returnHashMap.put("tip", false);
                String vueTemplate = ResourceUtil.readUtf8Str("MybatisPlusGeneratortemplates/crudTemplate.vue");
        
                String retultVueTemplate = vueTemplate.replace("$templateFieldList", Utils.getObjectMapper().writeValueAsString(fieldList))
                        .replace("$templateIdFieldName", Optional.ofNullable(idName.get()).map(i -> i.toString()).orElse("未知ID字段"))
                        .replace("$templateAvueTableOptions", Utils.getObjectMapper().writeValueAsString(returnHashMap));
                
                return retultVueTemplate;
                
            } catch (ClassNotFoundException e) {
                throw new ServiceException(LiubiCoreReturnCodeEnum.SERVER_ERROR.getCode(), String.format("反射实体%s出现错误:实体不存在", classFullPathName));
            } catch (IOException e) {
                throw new ServiceException(LiubiCoreReturnCodeEnum.SERVER_ERROR.getCode(), String.format("读取VUE模板文件失败:读取失败,%s", e.getMessage()));
            }
        
        }
        ```
#### 	执行原理

 - 后端生成

   mybatis-plus提供代码生成器功能，利用mybatis-plus特性自定义生成模板，可以达到生成后端代码，满足基本的CRUD等功能

 - 前端生成

   前端基于avue插件进行开发，使用该插件，可以通过JSON配置来配置基本的页面，对应的保存、新增、删除、编辑方法采用默认的模板实现，对应后端生成的方法。

   前端的一些校验，在后端生成实体后，需要手动的使用java校验注解进行修饰，例如NotBlack，NotNull等。此处生成前端代码时，会根据传入的实体类反射这些属性，以达到自动生成代码的功能。

#### 	操作步骤
-  建表，建表操作必须非常规范，注释，必须完整
-  执行**follow_visit\follow_visit\hcrm-architecture\hcrm-main\src\test\java\MybatisPlusGenerator.java**代码生成器，根据提示输入相关参数
-  修饰生成出的实体
-  修改生成出由于各个表字段不同，是否逻辑删除等特性产生的差异（模板方法为逻辑删除，scbz字段不一定存在)
-  前端通过swagger调用开发常用接口下的前端代码生成接口，参数传入实体类的全名称（com.xxx.xxx.xxx.xxxEntity）,将下载后的.vue文件放入前端项目src/views/crud文件夹下，并去**src/router/index.js**下配置该页面路由参数
-  前往前端生成出的代码文件中修改data中的部分参数（具体参数有中文提示）.

### 表单工程

#### 	功能概述
表单工程包括表单前端以及后端，前端工程分为两块，分别位于**src\views\form** 、 **src\views\form-design** 下  form文件夹下为表单的管理、填写、统计、查询模型配置等组件，form-design文件夹下为表单的设计器页面，form-design下design.vue为设计器的包装展示组件，packages文件夹下为设计器组件。

packages文件夹目类介绍

-  assets 静态资源文件夹（将会被base64编码打包到代码中）
-  component 自定义组件目录
-  config 组件的配置组件，用来渲染表单拖拽到目标区域后的配置管理
-  global 一些工具函数
-  styles 表单设计器样式文件
-  fieldsConfig.js 表单设计器组件栏目配置(存放一些组件的默认值)
-  FormConfig.vue 表单配置组件
-  index.js 自定义组件注册接口
-  其他文件  表单设计器布局页面的区域组件（预览，导入导出等等）

表单后端工程位于**follow_visit\follow_visit\hcrm-architecture\hcrm-base-support\hcrm-sys\src\main\java\cn\stylefeng\guns\sys\modular\vue\business\form** 包下。

表单模块共包含5张表，分别如下（字段注释齐全，不做字段解释）：

- hcrm_form_field  表单模型字段

- hcrm_form_fill_record 表单填写记录表

- hcrm_form_fill_record_detail 表单填写记录详细

- hcrm_form_model  表单模型表 用于存放表单模型

- hcrm_form_model_modify_record 表单模型操作记录表 用于记录每次操作前的表单，用来防止配置失误

  表结构：

  ![image-20210702163437095](image/README/image-20210702163437095.png)

#### 	执行原理

前端通过表单设计器生成表单模型后，后端会对模型进行处理，拆分表单所用到的字段，对删除的字段进行逻辑删除处理，同时推送一个表单模板到之前的随访表单模板表中。前端提交表单内容时，后端会对提交内容进行拆解，拆解后创建一条表单填写记录，详细的每个字段的填写记录将会被拆解到填写详细记录表。

#### 	操作步骤

- 前往表单管理页面添加表单

  ![image-20210702164402203](image/README/image-20210702164402203.png)

- 点击表格操作栏目中的其他功能->设计表单 即可对表单进行设计

  ![image-20210702164751403](image/README/image-20210702164751403.png)

  表单关键词解释：

  - 属性值  表单字段的英文名称

  - 标题 表单的题目名称

  - 表单栅格  表单横向被平均分为24分，一个栅格代表1/24， 但考虑到屏幕大小不一致，此处的栅格自定义只能定义大屏的情况，中、小、mini栅格一律默认为24

  - 自动回填 自动回填读取自字典表，数据来自接口**/getFormDefultValue** 接口，表单初次填写如果存在自动回填值，会自动调用该接口赋值。该接口会根据表单ID获取需要进行回填的字段，回填字段具体回填的编码来自于字典表配置。

    表单回填方式：例如表单回填配置为baseInfo:xm 此配置无任何意义，需要代码自己去解析，如页面配置baseInfo 代表基本信息，你需要将基本信息查询出来，然后获取基本信息中的xm字段，然后根据组件配置的prop进行回填！

  - 是否必填  勾选后，用户必须填写此字段才能进行提交

  - 表单评分 此字段作用与表单的选择字段，表单提交后会计算对应组件选中选项的分值之和，可在表单统计中查询。

  - 扩展功能—>相应控制：如果表单的组件类型为：下拉选择器、多选框组、单选按钮组、开关 则器包含显隐控制，显隐控制配置打字也买你如下：下图意义为，让开关选择关闭时 页面显示单行文本框 当开关选择开启时，显示年组件。 如果没有命中选中值，则对应组件隐藏！

    ![image-20210702171117578](image/README/image-20210702171117578.png)

- 设计完成后可点击保存，即可保存表单（编辑同理）

- 此时回到表单管理页面，点击其他功能->表单填写 即可填写该表单

- 其他功能->查询模型配置 此功能是为**其他功能->查询模型配置** 功能做配置，可配置哪些字段需要被查询，哪些字典主要做搜索，搜索类型，搜索排序，查询排序等属性

  ![image-20210702171457295](image/README/image-20210702171457295.png)

- 其他功能->查询模型配置 此处可查看表单填写情况，表单填写个字段情况

  ![image-20210702172401661](image/README/image-20210702172401661.png)

- 其他功能->表单填写情况 即可统计表单最近的发送、填写、填写分布等情况（仅限于选择类字段）

  ![image-20210702172522350](image/README/image-20210702172522350.png)

#### 	注意事项

表单工程在设计之初本意为一个独立的、与业务不耦合的方式进行设计，然后独立为二方库引入项目，但是由于业务其他模块耦合太重，实在无法维护。所以表单也与业务耦合到了一起，患者端使用表单全部以iframe进行嵌套的方式使用，因此在系统产量中定义了一个PC端的部署地址！

### 自定义查询前端工程

#### 	功能概述

自定义查询前端可通过界面配置生成自定义查询条件。

![image-20210706114229333](image/README/image-20210706114229333.png)

一个组内只允许存在一种模块的查询条件，该组内的子组、子行条件将会继承该模块

条件组之间、条件组与行之间、行与行之间并联关系为And和Or，默认为and

查询条件可以保存到服务器，服务器将查询条件保存到了病总配置项的表中，当进入自定义查询页面时，页面将会自动请求自定义查询条件。



#### 	执行原理

​	前端向根据字典配置项查询自定义查询到需要进行自定义查询的模块。

![image-20210706115137764](image/README/image-20210706115137764.png)

- 如果需要配置动态模块，类似**{ "type": "dynamicQuery", "remoteAddress": "/codeAuto/hcrmMaintainDownloadfiles/getExtFieldCustomQuery?ksid=${ksid}&bzid=${bzid}" }** 配置  type=dynamicQuery 代表这是一个动态模块，前端会请求remoteAddress接口，根据接口返回的数据进行动态渲染模块
- 如果模块下存在字段，则这将作为模块的子筛选条件存在，子筛选条件也可以进行动态配置。
  - {"type":"dateTime"} type标示目标条件的筛选值使用什么组件进行渲染。
  - { "type": "select", "multiple": false, "isRemoteDic": false, "dicData": [{ "code": 0, "name": "未确认" }, { "code": 1, "name": "已确认" }] } 如配置描述，此选项为下拉框，是否多选为非多选，是否远端字典为后，静态字典的数据
  - { "type": "remoteField", "remoteAddress": "/filterheader/queryFilterHeaderJoinIdList?page=1&limit=999&condition=&ksid=${ksid}&bzid=${bzid}&lxid=2", "parsingPath":"data", "fieldName":"remark", "fieldValue":"xmids" } 如图配置为字段为远端字段，原创地点为remoteAddress parsingPath表示请求回来的数据的解析路径 fieldName为字典的名称 fieldValue为字典的值