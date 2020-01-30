<template>
  <div class="app-container">
    <!-- 功能按钮栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="权限名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>

    </div>
    <!-- 数据列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="权限名"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="权限"
        min-width="150px"
      >
        <template slot-scope="{row}">
          {{ row.access }}
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        width="110px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.pass | statusFilter">
            {{ scope.row.pass?"绑定成功":'等待绑定' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="发布时间"
        width="160px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.createdAt) | formatTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit-outline"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>

          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row._id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <!-- 添加和修改界面 -->

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="权限名"
          prop="mobile"
        >
          <el-input v-model="temp.mobile" />
        </el-form-item>

        <el-form-item
          label="权限"
          prop="access"
        >
          <el-input v-model="temp.access" />
        </el-form-item>

        <el-form-item v-if="temp.createdAt" label="时间">
          {{ new Date(temp.createdAt) | parseTime }}
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetch, addModel, updateModel, deleteModel } from "@/api/user";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "User",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: "success",
        false: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        // 查询关键字
        isPaging: true,
        currentPage: 1,
        pageSize: 20,

        search: undefined
      },
      showReviewer: false,
      // 表单提交的数据
      temp: {
        id: undefined,
        name: "",
        access: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      // 验证方法
      rules: {
        name: [
          { required: true, message: "名称必须填写", trigger: "blur" }
        ],
        access: [
          { required: true, message: "权限必须填写", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetch(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.count;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        access: ""
      };
    },
    // 弹起添加界面
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 添加方法
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addModel(this.temp).then(res => {
            if (this.errorInfo(res)) return;
            this.list.unshift(res.data.data);
            this.dialogFormVisible = false;
            this.successInfo();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);

          updateModel(tempData._id, tempData).then(res => {
            if (this.errorInfo(res)) return;
            for (const v of this.list) {
              if (v._id === tempData._id) {
                this.list.splice(this.list.indexOf(v), 1, tempData);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.successInfo();
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteModel(id).then(res => {
            if (this.errorInfo(res)) return;
            for (const v of this.list) {
              if (v._id === id) {
                this.list.splice(this.list.indexOf(v), 1);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.successInfo();
          });
        })
    },
    successInfo() {
      this.$notify({
        title: "成功",
        message: "信息操作成功",
        type: "success",
        duration: 2000
      });
    },
    errorInfo(res) {
      if (res.data && res.data.code !== 0) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
