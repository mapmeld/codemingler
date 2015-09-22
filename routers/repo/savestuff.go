// Copyright 2014 The Gogs Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

package repo

import (
	"fmt"
  "github.com/gogits/gogs/modules/base"
	"github.com/gogits/gogs/modules/middleware"
)

const (
	SAVED base.TplName = "repo/view"
)

func SaveStuff(ctx *middleware.Context) {
	fmt.Println(ctx.Query("content"))
	ctx.HTML(200, SAVED)
}
